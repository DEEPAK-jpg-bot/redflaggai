import React from 'react';
import { cn } from '@/lib/utils';

interface BlurredContentProps {
  children: React.ReactNode;
  isBlurred: boolean;
  className?: string;
  overlayMessage?: string;
}

const BlurredContent: React.FC<BlurredContentProps> = ({
  children,
  isBlurred,
  className,
  overlayMessage = 'Upgrade to view details',
}) => {
  if (!isBlurred) {
    return <>{children}</>;
  }

  return (
    <div className={cn('relative', className)}>
      <div className="blur-md select-none pointer-events-none">{children}</div>
      <div className="absolute inset-0 flex items-center justify-center bg-background/50 backdrop-blur-sm rounded-lg">
        <div className="text-center p-4">
          <div className="text-sm font-medium text-muted-foreground">
            {overlayMessage}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlurredContent;