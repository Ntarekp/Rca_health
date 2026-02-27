"use client";

interface RecentConsultationsProps {
    data?: any[];
}

const RecentConsultations = ({ data = [] }: RecentConsultationsProps) => {
    // Helper to format time (e.g., "2 min ago")
    const formatTime = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

        if (diffInSeconds < 60) return `${diffInSeconds} sec ago`;
        const diffInMinutes = Math.floor(diffInSeconds / 60);
        if (diffInMinutes < 60) return `${diffInMinutes} min ago`;
        const diffInHours = Math.floor(diffInMinutes / 60);
        if (diffInHours < 24) return `${diffInHours} hours ago`;
        const diffInDays = Math.floor(diffInHours / 24);
        return `${diffInDays} days ago`;
    };

    return (
        <div className="bg-bg-card p-4 rounded-10 shadow-sm h-full">
            <h3 className="text-14px font-semibold text-text-secondary mb-4">Recent Consultations</h3>

            <div className="space-y-4">
                {data.length === 0 ? (
                    <p className="text-12px text-text-tertiary">No recent consultations.</p>
                ) : (
                    data.map((item) => (
                        <div key={item.visitId} className="relative pl-4 border-l-2 border-border-light pb-2 last:pb-0">
                            <div className="absolute -left-[5px] top-0 w-2.5 h-2.5 rounded-full bg-border"></div>

                            <div className="mb-1 flex justify-between items-start">
                                <span className="text-10px text-text-tertiary bg-gray-100 px-2 py-0.5 rounded-full">{formatTime(item.visitDateTime)}</span>
                                {/* Disposition is not in VisitDTO yet, I might need to add it or just show diagnosis */}
                                <span className={`text-10px px-2 py-0.5 rounded-full font-medium bg-success/20 text-success`}>
                                    Completed
                                </span>
                            </div>

                            <p className="text-12px font-medium text-text-primary mb-1">{item.studentName}</p>

                            <div className="bg-[#f8f9fc] p-2 rounded-5">
                                <p className="text-10px text-text-secondary"><span className="font-semibold">Reason:</span> {item.chiefComplaint}</p>
                                <p className="text-10px text-text-secondary"><span className="font-semibold">Diagnosis:</span> {item.diagnosis}</p>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default RecentConsultations;
