
import React, { useState } from 'react';
import { useAppData } from '../../App';
import { OnDemandVideo } from '../../types';
import { PlayCircle, X, Clock } from 'lucide-react';

// Modal para el reproductor de video
interface VideoPlayerModalProps {
    youtubeId: string;
    title: string;
    onClose: () => void;
}
const VideoPlayerModal: React.FC<VideoPlayerModalProps> = ({ youtubeId, title, onClose }) => {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-75 z-50 flex justify-center items-center p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl relative">
                <button onClick={onClose} className="absolute -top-3 -right-3 bg-white rounded-full p-1.5 text-stone-600 hover:text-stone-900 z-10">
                    <X className="w-6 h-6" />
                </button>
                <div className="aspect-w-16 aspect-h-9">
                    <iframe 
                        src={`https://www.youtube.com/embed/${youtubeId}?autoplay=1&rel=0`}
                        title={title}
                        frameBorder="0" 
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                        allowFullScreen
                        className="w-full h-full"
                    ></iframe>
                </div>
            </div>
        </div>
    );
};

// Tarjeta para cada video
const VideoCard: React.FC<{ video: OnDemandVideo, onPlay: (youtubeId: string, title: string) => void }> = ({ video, onPlay }) => {
    const { teachers } = useAppData();
    const teacher = teachers.find(t => t.id === video.teacherId);

    return (
        <div className="bg-white rounded-xl shadow-lg overflow-hidden group cursor-pointer" onClick={() => onPlay(video.youtubeId, video.title)}>
            <div className="relative">
                <img src={video.thumbnailUrl} alt={video.title} className="w-full h-48 object-cover" />
                <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <PlayCircle className="w-16 h-16 text-white" />
                </div>
            </div>
            <div className="p-5">
                <h3 className="text-lg font-bold text-stone-800 truncate">{video.title}</h3>
                <p className="text-sm text-stone-600 mt-1 h-10">{video.description}</p>
                <div className="flex justify-between items-center mt-4 pt-4 border-t border-stone-100 text-sm">
                    <p className="text-stone-500">con {teacher?.name}</p>
                    <div className="flex items-center text-stone-600 font-medium">
                        <Clock className="w-4 h-4 mr-1.5" />
                        <span>{video.duration} min</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

const OnDemandView: React.FC = () => {
    const { videos } = useAppData();
    const [playingVideo, setPlayingVideo] = useState<{ id: string, title: string } | null>(null);

    const handlePlayVideo = (youtubeId: string, title: string) => {
        setPlayingVideo({ id: youtubeId, title });
    };

    const handleClosePlayer = () => {
        setPlayingVideo(null);
    };

    return (
        <div className="space-y-6">
             <div>
                <h1 className="text-3xl font-bold text-stone-800">Videos On-Demand</h1>
                <p className="text-stone-500 mt-1">Practica yoga a tu propio ritmo, en cualquier momento y lugar.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {videos.map(video => (
                    <VideoCard key={video.id} video={video} onPlay={handlePlayVideo} />
                ))}
            </div>

            {playingVideo && (
                <VideoPlayerModal 
                    youtubeId={playingVideo.id}
                    title={playingVideo.title}
                    onClose={handleClosePlayer}
                />
            )}
        </div>
    );
};

export default OnDemandView;
