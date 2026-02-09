"use client";

const consultations = [
    {
        id: 1,
        time: '2 min ago',
        student: 'Keza Sarah',
        complaint: 'Headache',
        disposition: 'Returned to Class',
        doctor: 'Nurse Jane'
    },
    {
        id: 2,
        time: '15 min ago',
        student: 'Manzi David',
        complaint: 'Fever',
        disposition: 'Sent Home',
        doctor: 'Dr. John'
    },
    {
        id: 3,
        time: '45 min ago',
        student: 'Mutesi Joy',
        complaint: 'Injury',
        disposition: 'Transferred',
        doctor: 'Nurse Jane'
    },
    {
        id: 4,
        time: '1 hour ago',
        student: 'Hirwa Peter',
        complaint: 'Stomach Pain',
        disposition: 'Returned to Class',
        doctor: 'Dr. John'
    }
];

const RecentConsultations = () => {
    return (
        <div className="bg-bg-card p-4 rounded-10 shadow-sm h-full">
            <h3 className="text-14px font-semibold text-text-secondary mb-4">Recent Consultations</h3>

            <div className="space-y-4">
                {consultations.map((item) => (
                    <div key={item.id} className="relative pl-4 border-l-2 border-border-light pb-2 last:pb-0">
                        <div className="absolute -left-[5px] top-0 w-2.5 h-2.5 rounded-full bg-border"></div>

                        <div className="mb-1 flex justify-between items-start">
                            <span className="text-10px text-text-tertiary bg-gray-100 px-2 py-0.5 rounded-full">{item.time}</span>
                            <span className={`text-10px px-2 py-0.5 rounded-full font-medium ${item.disposition === 'Returned to Class' ? 'bg-success-bg text-success' :
                                item.disposition === 'Sent Home' ? 'bg-warning-bg text-warning' :
                                    'bg-error-bg text-error'
                                }`}>
                                {item.disposition}
                            </span>
                        </div>

                        <p className="text-12px font-medium text-text-primary mb-1">{item.student}</p>

                        <div className="bg-[#f8f9fc] p-2 rounded-5">
                            <p className="text-10px text-text-secondary"><span className="font-semibold">Reason:</span> {item.complaint}</p>
                            <p className="text-10px text-text-secondary"><span className="font-semibold">Attended by:</span> {item.doctor}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default RecentConsultations;
