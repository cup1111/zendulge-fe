import { Clock3 } from 'lucide-react';

import type { OperatingHourDay } from '~/services/operateSiteService';

import { Input } from './input';
import { Label } from './label';
import { Switch } from './switch';

const WEEK_DAYS = [
  { key: 'monday', label: 'Monday' },
  { key: 'tuesday', label: 'Tuesday' },
  { key: 'wednesday', label: 'Wednesday' },
  { key: 'thursday', label: 'Thursday' },
  { key: 'friday', label: 'Friday' },
  { key: 'saturday', label: 'Saturday' },
  { key: 'sunday', label: 'Sunday' },
] as const;

type WeekDayKey = (typeof WEEK_DAYS)[number]['key'];

interface OperatingHoursSectionProps {
  value: Record<string, OperatingHourDay>;
  onChange: (next: Record<string, OperatingHourDay>) => void;
}

export function OperatingHoursSection({
  value,
  onChange,
}: OperatingHoursSectionProps) {
  const handleChange = (
    day: WeekDayKey,
    field: keyof OperatingHourDay,
    v: boolean | string
  ) => {
    const prevDay = value[day] ?? { isClosed: false, open: '', close: '' };
    onChange({
      ...value,
      [day]: { ...prevDay, [field]: v },
    });
  };

  return (
    <div className='mt-4 rounded-xl border bg-muted/30 p-4'>
      <div className='mb-3 flex items-center justify-between'>
        <div className='flex items-center gap-2'>
          <Clock3 className='h-4 w-4 text-muted-foreground' />
          <div>
            <p className='text-sm font-medium'>Operating hours</p>
            <p className='text-xs text-muted-foreground'>
              Set which days this site is open and the hours for each day.
            </p>
          </div>
        </div>
        {/* 这里以后可以加「复制周一到周五」之类的按钮 */}
      </div>

      <div className='space-y-2'>
        {WEEK_DAYS.map(day => {
          const dayData: OperatingHourDay = value[day.key] ?? {
            isClosed: false,
            open: '',
            close: '',
          };

          const isClosed = !!dayData.isClosed;

          return (
            <div
              key={day.key}
              className='grid grid-cols-[120px,90px,minmax(0,1fr)] items-center gap-3 rounded-lg bg-background px-3 py-2'
            >
              {/* Day label */}
              <span className='text-sm font-medium'>{day.label}</span>

              {/* Open / closed switch */}
              <div className='flex items-center gap-2'>
                <Switch
                  id={`${day.key}-open`}
                  checked={!isClosed}
                  onCheckedChange={checked =>
                    handleChange(day.key, 'isClosed', !checked)
                  }
                />
                <Label
                  htmlFor={`${day.key}-open`}
                  className='text-xs text-muted-foreground'
                >
                  {isClosed ? 'Closed' : 'Open'}
                </Label>
              </div>

              {/* Time range */}
              {isClosed ? (
                <span className='text-xs text-muted-foreground'>
                  Closed all day
                </span>
              ) : (
                <div className='flex flex-wrap items-center gap-2'>
                  <div className='flex items-center gap-2'>
                    <span className='text-xs text-muted-foreground'>From</span>
                    <Input
                      type='time'
                      className='h-8 w-28'
                      value={dayData.open ?? ''}
                      onChange={e =>
                        handleChange(day.key, 'open', e.target.value)
                      }
                    />
                  </div>
                  <div className='flex items-center gap-2'>
                    <span className='text-xs text-muted-foreground'>to</span>
                    <Input
                      type='time'
                      className='h-8 w-28'
                      value={dayData.close ?? ''}
                      onChange={e =>
                        handleChange(day.key, 'close', e.target.value)
                      }
                    />
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
