# Business Register - 完整提取指南（一模一样）

## 🎯 目标

从 `D:\work\Zendulge-App\frontend\` 提取完整的 Business Register，**保留所有原始组件**，只修改后端调用。

---

## ✅ Step 1: 确认所有组件都已存在

### 检查清单（在 `D:\work\zendulge-fe` 项目中）

运行以下命令检查：

```bash
# 检查 UI 组件
ls app/components/ui/form.tsx
ls app/components/ui/animated-form-field.tsx
ls app/components/ui/animated-form-message.tsx
ls app/components/ui/checkbox.tsx
ls app/components/ui/collapsible.tsx

# 检查验证组件
ls app/components/phone/phone-validator.tsx
ls app/components/email/email-validator.tsx
ls app/components/address/structured-address-input.tsx
```

如果**任何文件不存在**，需要先从原项目复制。

---

## 📦 Step 2: 复制所有缺失的组件

### 2.1 批量复制 UI 组件

```bash
# 在 PowerShell 中运行（D:\work\zendulge-fe 目录下）

# 创建目录
New-Item -ItemType Directory -Path app\components\ui -Force
New-Item -ItemType Directory -Path app\components\phone -Force
New-Item -ItemType Directory -Path app\components\email -Force
New-Item -ItemType Directory -Path app\components\address -Force

# 复制所有 UI 组件
robocopy D:\work\Zendulge-App\frontend\app\components\ui app\components\ui *.tsx /S

# 复制验证组件
Copy-Item D:\work\Zendulge-App\frontend\app\components\phone\phone-validator.tsx app\components\phone\
Copy-Item D:\work\Zendulge-App\frontend\app\components\email\email-validator.tsx app\components\email\
Copy-Item D:\work\Zendulge-App\frontend\app\components\address\structured-address-input.tsx app\components\address\

# 如果 phone-validator 依赖 international-phone-input，也复制它
Copy-Item D:\work\Zendulge-App\frontend\app\components\phone\international-phone-input.tsx app\components\phone\

# 如果 email-validator 依赖 email-verification-input，也复制它
Copy-Item D:\work\Zendulge-App\frontend\app\components\email\email-verification-input.tsx app\components\email\
```

### 2.2 全局替换路径别名

在 VS Code 中：
1. 按 `Ctrl+Shift+H` 打开全局替换
2. 查找：`@/`
3. 替换为：`~/`
4. 范围：`app/components`
5. 点击"全部替换"

---

## 📝 Step 3: 创建 WELLNESS_CATEGORIES 类型

创建 `app/lib/types.ts`：

```typescript
export const WELLNESS_CATEGORIES = [
  "massage",
  "yoga",
  "meditation",
  "spa",
  "fitness",
  "nutrition",
  "beauty",
  "therapy",
  "acupuncture",
  "pilates",
  "reiki",
  "aromatherapy",
  "physiotherapy",
  "counseling",
  "naturopathy"
] as const;

export type WellnessCategory = typeof WELLNESS_CATEGORIES[number];
```

---

## 🚀 Step 4: 创建 Business Register 页面

创建 `app/routes/business-register.tsx`，从原项目的 `business-setup.tsx` 复制，并做以下 **4 处修改**：

### 修改 1: 删除后端 imports（第 6-7 行）

```typescript
// ❌ 删除这两行：
// import { useMutation } from "@tanstack/react-query";
// import { apiRequest, queryClient } from "@/lib/queryClient";
```

### 修改 2: 添加 ABN 字段到 schema（第 27-71 行之间）

```typescript
const businessSchema = z.object({
  name: z.string().min(1, "Business name is required"),
  description: z.string().optional(),
  
  // 🆕 添加 ABN 字段
  abn: z.string()
    .min(11, "ABN must be 11 digits")
    .max(14, "ABN must be 11 digits (may include spaces)")
    .regex(/^[0-9\s]+$/, "ABN must contain only numbers")
    .refine((val) => val.replace(/\s/g, "").length === 11, "ABN must be exactly 11 digits"),
  abnRegisteredName: z.string().min(1, "ABN registered business name is required"),
  
  categories: z.array(z.string()).min(1, "At least one service category is required"),
  // ... 保留其余所有字段不变
});
```

### 修改 3: 添加 ABN 默认值（第 106-134 行）

```typescript
defaultValues: {
  name: "",
  description: "",
  abn: "", // 🆕
  abnRegisteredName: "", // 🆕
  categories: [],
  // ... 保留其余
}
```

### 修改 4: 添加 abnInfo 到 sectionsOpen（第 87-95 行）

```typescript
const [sectionsOpen, setSectionsOpen] = useState({
  basicInfo: true,
  abnInfo: false, // 🆕 添加这行
  adminInfo: false,
  categories: false,
  address: false,
  contact: false,
  contactPerson: false,
  branding: false
});
```

### 修改 5: 修改 createBusinessMutation（第 154-200 行）

**完整替换**这一整段：

```typescript
// ✅ 新代码（替换原来的 useMutation）
const [isSubmitting, setIsSubmitting] = useState(false);

const createBusinessMutation = {
  mutate: async (data: BusinessFormData) => {
    setIsSubmitting(true);
    
    // Mock API 延迟
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    try {
      console.log("Business Registration Data (Demo Mode):", data);
      
      toast({
        title: "Welcome to Zendulge! 🎉",
        description: "Your business registration has been submitted (Demo mode - no data saved)",
      });
      
      setIsSubmitting(false);
      
      // 重置表单
      form.reset();
    } catch (error) {
      toast({
        title: "Error",
        description: "Registration failed. Please try again.",
        variant: "destructive",
      });
      setIsSubmitting(false);
    }
  },
  isPending: isSubmitting
};
```

### 修改 6: 更新 getFieldCompletion 函数（第 207-230 行）

在 `switch` 语句中添加：

```typescript
case 'abnInfo': // 🆕 添加这个 case
  return !!(values.abn && values.abnRegisteredName);
```

### 修改 7: 在 Progress Overview 中添加 ABN（第 252-260 行）

```typescript
const sectionTitles: Record<string, string> = {
  basicInfo: 'Basic Information',
  abnInfo: 'ABN Information', // 🆕 添加这行
  adminInfo: 'Admin Information',
  categories: 'Service Categories',
  // ... 其余不变
};
```

### 修改 8: 添加 ABN Information UI 区块

在 Basic Information 区块之后，Admin Information 区块之前，添加这个完整的区块：

```tsx
{/* ABN Information Section - 🆕 新增区块 */}
<Collapsible
  open={sectionsOpen.abnInfo}
  onOpenChange={() => toggleSection('abnInfo')}
>
  <Card className={`transition-all duration-200 ${sectionsOpen.abnInfo ? 'border-shadow-lavender/30' : ''}`}>
    <CollapsibleTrigger asChild>
      <CardHeader className="cursor-pointer hover:bg-gray-50/50 transition-colors">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Badge variant="outline" className="w-5 h-5 rounded-full p-0 flex items-center justify-center">
              <Hash className="w-3 h-3" />
            </Badge>
            <span>ABN Information</span>
            {getFieldCompletion('abnInfo') && <CheckCircle className="w-4 h-4 text-green-600" />}
          </div>
          <motion.div
            animate={{ rotate: sectionsOpen.abnInfo ? 180 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <ChevronDown className="w-5 h-5 text-gray-500" />
          </motion.div>
        </CardTitle>
      </CardHeader>
    </CollapsibleTrigger>
    
    <CollapsibleContent>
      <CardContent className="space-y-6">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <div className="flex items-start space-x-3">
            <Hash className="w-5 h-5 text-blue-600 mt-0.5" />
            <div>
              <h4 className="font-medium text-blue-900 mb-1">Australian Business Number</h4>
              <p className="text-sm text-blue-700">
                Your ABN is required for tax and business verification purposes. 
                You can look up your ABN at{' '}
                <a 
                  href="https://abr.business.gov.au/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="underline font-medium hover:text-blue-900"
                >
                  ABN Lookup
                </a>
              </p>
            </div>
          </div>
        </div>

        {/* ABN Number */}
        <AnimatedFormField
          control={form.control}
          name="abn"
          label="Australian Business Number (ABN)"
          placeholder="12 345 678 901"
          required
          customValidation={async (value) => {
            if (!value) {
              return { isValid: false, message: "ABN is required" };
            }
            
            const digitsOnly = value.replace(/\s/g, '');
            
            if (!/^[0-9]+$/.test(digitsOnly)) {
              return { isValid: false, message: "ABN must contain only numbers" };
            }
            
            if (digitsOnly.length !== 11) {
              return { isValid: false, message: "ABN must be exactly 11 digits" };
            }
            
            return { isValid: true, message: "Valid ABN format" };
          }}
          onChange={(e) => {
            // Auto-format ABN with spaces
            let value = e.target.value.replace(/\s/g, '');
            if (value.length > 2) {
              value = value.slice(0, 2) + ' ' + value.slice(2);
            }
            if (value.length > 6) {
              value = value.slice(0, 6) + ' ' + value.slice(6);
            }
            if (value.length > 10) {
              value = value.slice(0, 10) + ' ' + value.slice(10, 14);
            }
            form.setValue("abn", value);
          }}
        />

        {/* ABN Registered Name */}
        <AnimatedFormField
          control={form.control}
          name="abnRegisteredName"
          label="ABN Registered Business Name"
          placeholder="Official registered business name"
          required
          customValidation={async (value) => {
            if (!value || value.length < 1) {
              return { isValid: false, message: "ABN registered name is required" };
            }
            if (value.length > 200) {
              return { isValid: false, message: "Name is too long" };
            }
            return { isValid: true, message: "Valid registered name" };
          }}
        />

        <div className="text-xs text-gray-500 space-y-1">
          <p>• The registered name must match your ABN registration exactly</p>
          <p>• This helps us verify your business legitimacy</p>
        </div>
      </CardContent>
    </CollapsibleContent>
  </Card>
</Collapsible>
```

### 修改 9: 更新所有路径别名

在整个文件中，将所有 `@/` 替换为 `~/`：

```
查找：@/
替换：~/
```

---

## ✅ Step 5: 修改组件名称

将文件中的：
```typescript
export default function BusinessSetup({ onComplete }: BusinessSetupProps) {
```

改为：
```typescript
export default function BusinessRegister() {
```

并删除 `onComplete` 相关的代码（因为不需要回调）。

---

## 🧪 Step 6: 测试

```bash
npm run dev
```

访问：`http://localhost:5173/business-register`

### 测试清单：
- [ ] 页面正常加载
- [ ] 8 个区块都可以折叠/展开
- [ ] ABN 输入时自动格式化（12 345 678 901）
- [ ] 所有验证组件正常工作（PhoneValidator、EmailValidator、StructuredAddressInput）
- [ ] 动画效果正常（AnimatedFormField）
- [ ] 填写表单并提交，显示成功消息
- [ ] 查看浏览器控制台，可以看到提交的数据

---

## 📊 完整性检查

最终的 `business-register.tsx` 应该有：

- ✅ **1100+ 行代码**（与原始 business-setup.tsx 相同）
- ✅ **8 个可折叠区块**（Basic Info, ABN, Admin, Categories, Address, Contact, Contact Person, Branding）
- ✅ **所有原始验证组件**（AnimatedFormField、PhoneValidator、EmailValidator、StructuredAddressInput）
- ✅ **所有原始动画**（motion.div）
- ✅ **所有原始样式**（shadow-lavender、frosted-lilac 等）
- ✅ **ABN 字段**（新增）
- ❌ **无后端调用**（useMutation、apiRequest 已删除）

---

## 🎉 完成！

现在你有了一个**完全一样的** Business Register 页面，只是提交后数据不会发送到后端，而是显示在控制台中。

**所有 UI、验证、动画、样式都和原来一模一样！** ✨

