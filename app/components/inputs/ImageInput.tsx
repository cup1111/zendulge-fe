import type { AxiosError } from 'axios';
import { useRef, useState } from 'react';

import { API_CONFIG } from '~/config/api';
import zendulgeAxios from '~/config/axios';

import { Button } from '../ui/button';

interface ImageInputProps {
  onChange: (value: string) => void;
  onUploadError: (error: Error | AxiosError) => void;
  logoUrl: string;
}

export default function ImageInput({
  onChange,
  onUploadError,
  logoUrl,
}: ImageInputProps) {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [isLoadingImage, setIsLoadingImage] = useState<boolean>(false);
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsLoadingImage(true);
    if (e.target.files && e.target.files.length > 0) {
      const fileFormData = new FormData();
      const imageFile = e.target.files[0];
      fileFormData.append('file', imageFile);
      try {
        const response = await zendulgeAxios.post(
          API_CONFIG.endpoints.business.uploadImage,
          fileFormData,
          {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          }
        );
        onChange(response.data.data.presignedUrl);
        if (response.data.data.presignedUrl) {
          setImageUrl(URL.createObjectURL(imageFile));
        }
      } catch (error: unknown) {
        // Type guard to ensure error is an Error or AxiosError
        if (error instanceof Error) {
          onUploadError(error);
        } else {
          // Fallback for unexpected error types
          onUploadError(new Error('An unknown error occurred during upload'));
        }
      } finally {
        setIsLoadingImage(false);
      }
    }
  };
  return (
    <div className='flex items-center space-x-2'>
      {!isLoadingImage && (
        <input
          ref={inputRef}
          type='file'
          accept='image/*'
          className='hidden'
          onChange={e => handleImageUpload(e)}
        />
      )}
      {logoUrl && imageUrl ? (
        <button
          type='button'
          onClick={() => {
            inputRef.current?.click();
          }}
          className='relative group cursor-pointer'
        >
          <img
            src={imageUrl}
            alt='Logo'
            className='w-20 h-20 object-cover rounded-lg'
          />
          <div className='absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 rounded-lg transition' />
        </button>
      ) : (
        <Button
          size='sm'
          onClick={() => {
            inputRef.current?.click();
          }}
          disabled={isLoadingImage}
        >
          {isLoadingImage ? 'Uploading...' : 'Upload Logo'}
        </Button>
      )}
    </div>
  );
}
