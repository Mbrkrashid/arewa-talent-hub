interface VideoInfoProps {
  title: string;
  artist: string;
  description?: string;
}

export const VideoInfo = ({ title, artist, description }: VideoInfoProps) => {
  return (
    <div className="absolute bottom-24 left-4 right-20 text-white">
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className="text-sm text-white/80 mb-2">@{artist}</p>
      {description && (
        <p className="text-sm text-white/60 line-clamp-2">{description}</p>
      )}
    </div>
  );
};