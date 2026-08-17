/**
 * Compresses any image file (JPEG, PNG, HEIC, WEBP, BMP, GIF, SVG) to JPEG format,
 * converting all image formats to JPEG (.jpg) and reducing dimensions so it easily fits within limits.
 */
export function compressToJpeg(
  file: File | Blob,
  maxDim: number = 800,
  quality: number = 0.75
): Promise<File> {
  return new Promise((resolve) => {
    const origName = (file as File).name || 'photo.jpg';
    const fileType = file.type || '';
    const isImage = fileType.startsWith('image/') || /\.(jpe?g|png|webp|heic|bmp|gif|svg)$/i.test(origName);

    if (!isImage) {
      // Non-image document file (e.g. PDF document)
      const f = file instanceof File ? file : new File([file], origName, { type: fileType || 'application/pdf' });
      resolve(f);
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        if (width > maxDim || height > maxDim) {
          if (width > height) {
            height = Math.round((height * maxDim) / width);
            width = maxDim;
          } else {
            width = Math.round((width * maxDim) / height);
            height = maxDim;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          const f = file instanceof File ? file : new File([file], 'photo.jpg', { type: 'image/jpeg' });
          resolve(f);
          return;
        }

        // Fill solid white background so transparent PNGs/SVGs render cleanly without black artifacts
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, width, height);
        ctx.drawImage(img, 0, 0, width, height);

        canvas.toBlob(
          (blob) => {
            const baseName = origName.replace(/\.[^/.]+$/, '') || 'photo';
            const jpegFileName = `${baseName}.jpg`;
            if (blob) {
              const compressedFile = new File([blob], jpegFileName, {
                type: 'image/jpeg',
                lastModified: Date.now(),
              });
              resolve(compressedFile);
            } else {
              const f = file instanceof File ? file : new File([file], jpegFileName, { type: 'image/jpeg' });
              resolve(f);
            }
          },
          'image/jpeg',
          quality
        );
      };

      img.onerror = () => {
        const baseName = origName.replace(/\.[^/.]+$/, '') || 'photo';
        const f = file instanceof File ? file : new File([file], `${baseName}.jpg`, { type: 'image/jpeg' });
        resolve(f);
      };

      img.src = e.target?.result as string;
    };

    reader.onerror = () => {
      const baseName = origName.replace(/\.[^/.]+$/, '') || 'photo';
      const f = file instanceof File ? file : new File([file], `${baseName}.jpg`, { type: 'image/jpeg' });
      resolve(f);
    };

    reader.readAsDataURL(file);
  });
}

/**
 * Compresses and center-crops an avatar image into a 1:1 square canvas (300x300).
 */
export function compressToAvatar(
  file: File | Blob,
  avatarSize: number = 300,
  quality: number = 0.85
): Promise<File> {
  return new Promise((resolve) => {
    const origName = (file as File).name || 'avatar.jpg';
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const minDim = Math.min(img.width, img.height);
        const sx = (img.width - minDim) / 2;
        const sy = (img.height - minDim) / 2;

        const canvas = document.createElement('canvas');
        canvas.width = avatarSize;
        canvas.height = avatarSize;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(file instanceof File ? file : new File([file], 'avatar.jpg', { type: 'image/jpeg' }));
          return;
        }

        ctx.fillStyle = '#0F172A';
        ctx.fillRect(0, 0, avatarSize, avatarSize);
        ctx.drawImage(img, sx, sy, minDim, minDim, 0, 0, avatarSize, avatarSize);

        canvas.toBlob(
          (blob) => {
            const baseName = origName.replace(/\.[^/.]+$/, '') || 'avatar';
            if (blob) {
              const avatarFile = new File([blob], `${baseName}_avatar.jpg`, {
                type: 'image/jpeg',
                lastModified: Date.now(),
              });
              resolve(avatarFile);
            } else {
              resolve(file instanceof File ? file : new File([file], `${baseName}_avatar.jpg`, { type: 'image/jpeg' }));
            }
          },
          'image/jpeg',
          quality
        );
      };

      img.onerror = () => {
        resolve(file instanceof File ? file : new File([file], 'avatar.jpg', { type: 'image/jpeg' }));
      };

      img.src = e.target?.result as string;
    };

    reader.onerror = () => {
      resolve(file instanceof File ? file : new File([file], 'avatar.jpg', { type: 'image/jpeg' }));
    };

    reader.readAsDataURL(file);
  });
}

/**
 * Uploads a profile avatar. Automatically center-crops and resizes to 300x300 JPEG.
 */
export async function uploadAvatar(file: File | Blob): Promise<string> {
  let croppedAvatar: File;
  try {
    croppedAvatar = await compressToAvatar(file, 300, 0.85);
  } catch (err) {
    console.warn('Avatar cropping warning, using original file:', err);
    croppedAvatar = file instanceof File ? file : new File([file], 'avatar.jpg', { type: file.type || 'image/jpeg' });
  }

  return uploadImage(croppedAvatar);
}

/**
 * Uploads an image/document. Automatically compresses images to lightweight JPEG,
 * converts to base64, and sends to /api/upload.
 */
export async function uploadImage(file: File | Blob): Promise<string> {
  let compressedJpeg: File;
  try {
    compressedJpeg = await compressToJpeg(file, 800, 0.70);
  } catch (err) {
    console.warn('Image compression warning, using original file:', err);
    compressedJpeg = file instanceof File ? file : new File([file], 'photo.jpg', { type: file.type || 'image/jpeg' });
  }

  const base64Data = await convertToBase64(compressedJpeg);
  const mimeType = compressedJpeg.type || 'image/jpeg';
  const dataUrl = `data:${mimeType};base64,${base64Data}`;

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3500);

    let token = '';
    try {
      const stored = localStorage.getItem('nordbase_work_state_v2');
      if (stored) {
        const parsed = JSON.parse(stored);
        token = parsed?.currentUser?.token || '';
      }
    } catch (e) { /* ignore */ }

    const headers: Record<string, string> = {
      'Content-Type': 'application/json'
    };
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const res = await fetch('/api/upload', {
      method: 'POST',
      headers,
      body: JSON.stringify({
        filename: compressedJpeg.name,
        contentType: mimeType,
        base64: base64Data
      }),
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    if (res.ok) {
      const data = await res.json();
      if (data && data.url) {
        return data.url;
      }
    } else {
      console.warn(`Server upload returned status ${res.status}. Falling back to Data URL.`);
    }
  } catch (netErr) {
    console.warn('Network or timeout during upload, falling back to client Data URL:', netErr);
  }

  // Graceful fallback: return the client-side base64 Data URL so user's image displays instantly
  return dataUrl;
}

function convertToBase64(file: File | Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      const base64 = result.includes(',') ? result.split(',')[1] : result;
      resolve(base64);
    };
    reader.onerror = error => reject(error);
    reader.readAsDataURL(file);
  });
}
