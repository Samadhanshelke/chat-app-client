import React from 'react';
// import Avatar from '../assets/avatar.svg'
interface AvatarProps {
  src: string;
  alt?: string;
  className?: string;
  size?: number;
  onClick?: () => void;
}

const Avatar: React.FC<AvatarProps> = ({
  src='../assets/avatar.svg',
  alt = 'Avatar',
  className = '',
  size = 40,
  onClick,
}) => {
  return (
    <img
      src={src}
      alt={alt}
      onClick={onClick}
      className={`rounded-full object-cover ${className}`}
      style={{ width: size, height: size, cursor: onClick ? 'pointer' : 'default' }}
    />
  );
};

export default Avatar;
