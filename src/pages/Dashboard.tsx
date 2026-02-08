
import { Plus, Users, Calendar, AlertTriangle, Activity, UserPlus, FileText } from 'lucide-react';
import StatsCard from '../features/dashboard/StatsCard';
import ChartsSection from '../features/dashboard/ChartsSection';
import AppointmentsTable from '../features/dashboard/AppointmentsTable';
import RecentConsultations from '../features/dashboard/RecentConsultations';

const Dashboard = () => {
  return (
    <div className="space-y-8 pb-10">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-[14px] text-[var(--color-text-tertiary)] font-normal mb-1">Good morning, Nurse</h2>
          <h1 className="text-[24px] font-semibold text-[var(--color-primary)]">Student Health Dashboard</h1>
          <p className="text-[12px] text-[var(--color-text-tertiary)]">Overview of student health and consultations</p>
        </div>

        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-[var(--color-primary)] text-white rounded-[var(--radius-5)] hover:bg-[var(--color-primary-dark)] transition-colors">
            <Plus size={16} />
            <span className="text-[14px] font-medium">New Consultation</span>
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-white text-[var(--color-primary)] rounded-[var(--radius-5)] border border-[var(--color-border)] hover:bg-gray-50 transition-colors">
            <UserPlus size={16} />
            <span className="text-[14px] font-medium">Register Student</span>
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-white text-[var(--color-text-secondary)] rounded-[var(--radius-5)] border border-[var(--color-border)] hover:bg-gray-50 transition-colors">
            <FileText size={16} />
            <span className="text-[14px] font-medium">Reports</span>
          </button>
        </div>
      </div>

      {/* Date Filter - Mockup */}
      <div className="flex items-center gap-2">
        <button className="flex items-center gap-2 px-3 py-1.5 bg-white border border-[var(--color-border)] rounded-[var(--radius-5)] text-[12px] font-medium text-[var(--color-text-secondary)]">
          <span>This Month</span>
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-4 gap-6">
        <StatsCard
          title="Total Students"
          value="1,245"
          trend={12}
          trendDirection="up"
          variant="primary"
          icon={<Users size={20} />}
        />
        <StatsCard
          title="Appointments Today"
          value="42"
          trend={5}
          trendDirection="up"
          variant="default"
          icon={<Calendar size={20} />}
        />
        <StatsCard
          title="Critical Alerts"
          value="3"
          trend={2}
          trendDirection="down"
          variant="default"
          icon={<AlertTriangle size={20} className="text-[var(--color-error)]" />}
        />
        <StatsCard
          title="Consultations This Month"
          value="156"
          trend={8}
          trendDirection="up"
          variant="default"
          icon={<Activity size={20} />}
        />
      </div>

      {/* Charts Section */}
      <ChartsSection />

      {/* Appointments Table & Recent Consultations */}
      <div className="grid grid-cols-4 gap-6">
        <div className="col-span-3">
          <AppointmentsTable />
        </div>
        <div className="col-span-1">
          <RecentConsultations />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
