/**
 * Avatar Component
 *
 * Displays a user avatar with initial-based or gradient placeholder.
 * Shows either ENS name or truncated address.
 */

type AvatarProps = {
  displayName: string;
  address: string;
  size?: 'sm' | 'md' | 'lg';
};

function getInitials(displayName: string): string {
  // Extract initials from display name
  // For ENS names like "alice.eth", use "A"
  // For addresses like "0x1234...abcd", use first char after 0x
  if (displayName.includes('.eth')) {
    return displayName.charAt(0).toUpperCase();
  }
  // For addresses, skip "0x" and use first character
  const cleanName = displayName.replace(/^0x/i, '');
  return cleanName.charAt(0).toUpperCase() || '?';
}

function getGradientColor(address: string): string {
  // Generate a consistent gradient color based on address
  // Use the last few characters to create a hash-like color
  const hash = address.slice(-6);
  const hue = parseInt(hash.slice(0, 2), 16) % 360;
  return `hsl(${hue}, 65%, 55%)`;
}

export function Avatar({ displayName, address, size = 'md' }: AvatarProps) {
  const initials = getInitials(displayName);
  const gradientColor = getGradientColor(address);
  
  const sizeClasses = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-16 h-16 text-lg',
  };

  return (
    <div
      className={`${sizeClasses[size]} rounded-full flex items-center justify-center font-semibold text-white border-2 border-gray-200 dark:border-gray-700 flex-shrink-0`}
      style={{
        background: `linear-gradient(135deg, ${gradientColor}, ${gradientColor}dd)`,
      }}
      aria-label={`Avatar for ${displayName}`}
    >
      {initials}
    </div>
  );
}

