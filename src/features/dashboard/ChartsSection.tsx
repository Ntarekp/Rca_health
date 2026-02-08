
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const dataBar = [
    { name: 'Jan', consultations: 180 },
    { name: 'Feb', consultations: 250 },
    { name: 'Mar', consultations: 160 },
    { name: 'Apr', consultations: 140 },
    { name: 'May', consultations: 190 },
    { name: 'Jun', consultations: 220 },
    { name: 'Jul', consultations: 150 },
    { name: 'Aug', consultations: 170 },
    { name: 'Sep', consultations: 280 },
    { name: 'Oct', consultations: 260 },
    { name: 'Nov', consultations: 180 },
    { name: 'Dec', consultations: 120 },
];

const dataPie = [
    { name: 'Returned to Class', value: 70, color: '#14ae5c' },
    { name: 'Sent Home', value: 25, color: '#f59e0b' },
    { name: 'Transferred', value: 5, color: '#dc2626' },
];

const ChartsSection = () => {
    return (
        <div className="grid grid-cols-12 gap-6 h-[400px]">
            {/* Bar Chart */}
            <div className="col-span-8 bg-[var(--color-bg-card)] p-6 rounded-[var(--radius-10)] shadow-sm">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-[18px] font-semibold text-[var(--color-text-primary)]">Monthly Consultations</h3>
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                            <span className="w-3 h-3 rounded-full bg-[var(--color-primary)]"></span>
                            <span className="text-[12px] text-[var(--color-text-secondary)]">Consultations</span>
                        </div>
                        <select className="bg-transparent border border-[var(--color-border)] rounded-[var(--radius-5)] text-[12px] px-2 py-1 outline-none">
                            <option>This year</option>
                        </select>
                    </div>
                </div>

                <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={dataBar} barGap={8}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--color-border-light)" />
                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'var(--color-text-secondary)' }} dy={10} />
                        <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'var(--color-text-secondary)' }} />
                        <Tooltip
                            cursor={{ fill: 'transparent' }}
                            contentStyle={{ backgroundColor: 'var(--color-bg-card)', borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                        />
                        <Bar dataKey="consultations" fill="var(--color-primary)" radius={[4, 4, 0, 0]} barSize={24} />
                    </BarChart>
                </ResponsiveContainer>
            </div>

            {/* Donut Chart */}
            <div className="col-span-4 bg-[var(--color-bg-card)] p-6 rounded-[var(--radius-10)] shadow-sm flex flex-col">
                <div className="flex justify-between items-center mb-2">
                    <h3 className="text-[18px] font-semibold text-[var(--color-text-primary)]">Disposition</h3>
                    <select className="bg-transparent border border-[var(--color-border)] rounded-[var(--radius-5)] text-[10px] px-2 py-1 outline-none">
                        <option>This Month</option>
                    </select>
                </div>

                <div className="flex-1 flex items-center relative">
                    <ResponsiveContainer width="100%" height={250}>
                        <PieChart>
                            <Pie
                                data={dataPie}
                                innerRadius={60}
                                outerRadius={80}
                                paddingAngle={5}
                                dataKey="value"
                                stroke="none"
                            >
                                {dataPie.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                            </Pie>
                            <Tooltip />
                        </PieChart>
                    </ResponsiveContainer>

                    {/* Center Text */}
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none">
                        <p className="text-[10px] text-[var(--color-text-secondary)]">Total</p>
                        <p className="text-[24px] font-bold text-[var(--color-text-primary)]">1,245</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-3 mt-4">
                    {dataPie.map((item) => (
                        <div key={item.name} className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }}></span>
                            <span className="text-[12px] text-[var(--color-text-secondary)]">{item.name}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ChartsSection;
