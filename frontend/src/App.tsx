import { useMemo, useState } from 'react';

interface Vehicle {
  id: string;
  model: string;
  status: 'Available' | 'In Service' | 'Reserved' | 'Outbound';
  location: string;
  mileage: number;
  updated: string;
}

interface ActivityItem {
  id: string;
  title: string;
  time: string;
  description: string;
  category: 'Order' | 'Reservation' | 'Maintenance';
}

const vehicleInventory: Vehicle[] = [
  {
    id: 'PCN-1023',
    model: 'Delivery Van XL',
    status: 'Available',
    location: 'Dallas, TX',
    mileage: 42880,
    updated: 'Today · 2:30 PM',
  },
  {
    id: 'PCN-1044',
    model: 'Transit Cargo 250',
    status: 'Reserved',
    location: 'Houston, TX',
    mileage: 58920,
    updated: 'Today · 11:20 AM',
  },
  {
    id: 'PCN-1118',
    model: 'Refrigerated Box Truck',
    status: 'In Service',
    location: 'Tulsa, OK',
    mileage: 71205,
    updated: 'Yesterday · 5:45 PM',
  },
  {
    id: 'PCN-0891',
    model: 'Sprinter 170 High Roof',
    status: 'Outbound',
    location: 'Austin, TX',
    mileage: 36110,
    updated: 'Today · 9:05 AM',
  },
  {
    id: 'PCN-0974',
    model: 'Long-Haul Tractor',
    status: 'Available',
    location: 'Oklahoma City, OK',
    mileage: 128430,
    updated: 'Monday · 3:00 PM',
  },
];

const activityFeed: ActivityItem[] = [
  {
    id: '1',
    title: 'Order #4821 released to carrier',
    time: '12 mins ago',
    description: 'Finalized paperwork and notified Dallas dispatch.',
    category: 'Order',
  },
  {
    id: '2',
    title: 'Reservation confirmed for PCN-1044',
    time: '2 hrs ago',
    description: 'Reserved for Houston route Wednesday 7:00 AM.',
    category: 'Reservation',
  },
  {
    id: '3',
    title: 'Maintenance completed',
    time: 'Yesterday',
    description: 'Brake inspection and fluid top-off for PCN-1118.',
    category: 'Maintenance',
  },
];

const statusColorMap: Record<Vehicle['status'], string> = {
  Available: 'badge badge-success',
  'In Service': 'badge badge-warning',
  Reserved: 'badge badge-info',
  Outbound: 'badge badge-info',
};

const StatCard = ({ title, value, meta }: { title: string; value: string; meta: string }) => (
  <div className="section-card">
    <p className="text-sm text-slate-500">{title}</p>
    <div className="mt-2 flex items-center justify-between">
      <p className="text-3xl font-semibold text-slate-900">{value}</p>
      <span className="text-sm font-medium text-emerald-600">{meta}</span>
    </div>
  </div>
);

function App() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | Vehicle['status']>('All');

  const filteredVehicles = useMemo(() => {
    return vehicleInventory.filter((vehicle) => {
      const matchQuery = `${vehicle.id} ${vehicle.model} ${vehicle.location}`
        .toLowerCase()
        .includes(search.toLowerCase());
      const matchStatus = statusFilter === 'All' || vehicle.status === statusFilter;
      return matchQuery && matchStatus;
    });
  }, [search, statusFilter]);

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="border-b border-slate-200 bg-white/70 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10 text-lg font-semibold text-primary shadow-card">
              PCN
            </div>
            <div>
              <p className="text-lg font-semibold text-slate-900">PCN Inventory</p>
              <p className="text-sm text-slate-500">Fleet health, orders, and reservations</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <input
                className="w-72 rounded-lg border border-slate-200 bg-slate-50 px-4 py-2 text-sm text-slate-800 shadow-inner focus:border-primary focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/30"
                placeholder="Search vehicles, routes, or orders"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
              />
            </div>
            <button className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-800 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
              Export report
            </button>
            <button className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white shadow-md transition hover:-translate-y-0.5 hover:bg-sky-500">
              + New record
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 py-10 space-y-8">
        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard title="Active fleet" value="248" meta="18 vehicles available now" />
          <StatCard title="Orders in motion" value="64" meta="12 handoffs today" />
          <StatCard title="Upcoming reservations" value="32" meta="Next 7 days" />
          <StatCard title="Service due" value="9" meta="3 scheduled this week" />
        </section>

        <section className="grid gap-6 lg:grid-cols-3">
          <div className="section-card lg:col-span-2">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-sm font-semibold text-slate-900">Inventory overview</p>
                <p className="text-sm text-slate-500">Track availability, readiness, and last updates</p>
              </div>
              <div className="flex gap-2 rounded-full bg-slate-100 p-1 text-sm font-medium text-slate-600">
                {(['All', 'Available', 'Outbound', 'Reserved', 'In Service'] as const).map((filter) => (
                  <button
                    key={filter}
                    className={`rounded-full px-3 py-1 transition ${statusFilter === filter ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-900'}`}
                    onClick={() => setStatusFilter(filter as typeof statusFilter)}
                  >
                    {filter}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-5 overflow-hidden rounded-xl border border-slate-200 bg-white">
              <div className="grid grid-cols-12 bg-slate-100 px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                <p className="col-span-3">Vehicle</p>
                <p className="col-span-2">Status</p>
                <p className="col-span-3">Location</p>
                <p className="col-span-2">Mileage</p>
                <p className="col-span-2 text-right">Updated</p>
              </div>
              <div className="divide-y divide-slate-200">
                {filteredVehicles.map((vehicle) => (
                  <div key={vehicle.id} className="grid grid-cols-12 items-center px-4 py-3 text-sm text-slate-800 transition hover:bg-slate-50">
                    <div className="col-span-3">
                      <p className="font-semibold text-slate-900">{vehicle.id}</p>
                      <p className="text-xs text-slate-500">{vehicle.model}</p>
                    </div>
                    <div className="col-span-2">
                      <span className={statusColorMap[vehicle.status]}>{vehicle.status}</span>
                    </div>
                    <div className="col-span-3">
                      <p className="font-medium">{vehicle.location}</p>
                      <p className="text-xs text-slate-500">Distribution</p>
                    </div>
                    <div className="col-span-2">
                      <p className="font-medium">{vehicle.mileage.toLocaleString()} mi</p>
                      <p className="text-xs text-slate-500">Lifetime</p>
                    </div>
                    <p className="col-span-2 text-right text-xs text-slate-500">{vehicle.updated}</p>
                  </div>
                ))}
                {filteredVehicles.length === 0 && (
                  <div className="px-4 py-6 text-sm text-slate-500">No vehicles match the selected filters.</div>
                )}
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-6">
            <div className="section-card">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-slate-900">Upcoming handoffs</p>
                  <p className="text-sm text-slate-500">Confirm details before dispatch</p>
                </div>
                <span className="badge badge-info">5 today</span>
              </div>
              <div className="mt-4 space-y-3 text-sm">
                {[
                  { label: '7:00 AM', name: 'Houston regional', asset: 'PCN-1044' },
                  { label: '9:30 AM', name: 'Dallas express', asset: 'PCN-0891' },
                  { label: '1:00 PM', name: 'Austin cold chain', asset: 'PCN-1023' },
                  { label: '4:15 PM', name: 'Tulsa return', asset: 'PCN-1118' },
                ].map((handoff) => (
                  <div key={handoff.name} className="flex items-start justify-between rounded-lg border border-slate-200 px-3 py-2">
                    <div>
                      <p className="text-xs uppercase tracking-wide text-slate-500">{handoff.label}</p>
                      <p className="font-semibold text-slate-900">{handoff.name}</p>
                      <p className="text-xs text-slate-500">Asset {handoff.asset}</p>
                    </div>
                    <button className="text-sm font-semibold text-primary hover:text-sky-500">Open</button>
                  </div>
                ))}
              </div>
            </div>

            <div className="section-card">
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold text-slate-900">New reservation</p>
                <span className="badge badge-success">Instant confirmation</span>
              </div>
              <form className="mt-4 space-y-3 text-sm">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wide text-slate-500">Vehicle ID</label>
                  <input className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20" placeholder="e.g. PCN-1044" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wide text-slate-500">Pickup</label>
                    <input type="date" className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wide text-slate-500">Return</label>
                    <input type="date" className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wide text-slate-500">Origin</label>
                    <input className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20" placeholder="Dallas" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wide text-slate-500">Destination</label>
                    <input className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20" placeholder="Houston" />
                  </div>
                </div>
                <button
                  type="button"
                  className="w-full rounded-lg bg-accent px-4 py-2 font-semibold text-white shadow-md transition hover:-translate-y-0.5 hover:bg-slate-900"
                >
                  Submit reservation
                </button>
              </form>
            </div>
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-3">
          <div className="section-card lg:col-span-2">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-slate-900">Operations feed</p>
                <p className="text-sm text-slate-500">Latest movements across orders, reservations, and maintenance</p>
              </div>
              <button className="text-sm font-semibold text-primary hover:text-sky-500">View all</button>
            </div>
            <div className="mt-4 divide-y divide-slate-200">
              {activityFeed.map((item) => (
                <div key={item.id} className="flex items-start gap-4 py-4">
                  <div className="mt-1 h-2.5 w-2.5 rounded-full bg-primary"></div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <p className="font-semibold text-slate-900">{item.title}</p>
                      <span className="text-xs text-slate-500">{item.time}</span>
                    </div>
                    <p className="text-sm text-slate-600">{item.description}</p>
                    <span className="mt-2 inline-flex rounded-full bg-slate-100 px-2 py-1 text-xs font-semibold text-slate-700">
                      {item.category}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="section-card">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-slate-900">Customer inquiries</p>
              <span className="badge badge-info">New: 4</span>
            </div>
            <form className="mt-4 space-y-3 text-sm">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wide text-slate-500">Contact name</label>
                <input className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20" placeholder="Alex Carter" />
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wide text-slate-500">Email</label>
                <input type="email" className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20" placeholder="name@company.com" />
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wide text-slate-500">Inquiry details</label>
                <textarea
                  rows={3}
                  className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                  placeholder="Requested refrigerated unit for Austin corridor next Monday."
                />
              </div>
              <button
                type="button"
                className="w-full rounded-lg border border-primary bg-primary/10 px-4 py-2 font-semibold text-primary transition hover:-translate-y-0.5 hover:bg-primary/20"
              >
                Log inquiry
              </button>
            </form>
            <div className="mt-4 rounded-lg bg-slate-50 p-3 text-xs text-slate-600">
              <p className="font-semibold text-slate-900">Response standard</p>
              <p className="mt-1">
                Maintain a <span className="text-emerald-600">1 hour response</span> for high-priority requests and
                flag vehicles with compliance holds before promising availability.
              </p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

export default App;
