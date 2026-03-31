import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  MdDashboard, 
  MdInventory, 
  MdAccessTime, 
  MdPeople, 
  MdTerminal, 
  MdAdd, 
  MdInventory2, 
  MdTrendingUp, 
  MdHistory, 
  MdLogout, 
  MdDarkMode, 
  MdLightMode, 
  MdClose, 
  MdChevronRight, 
  MdRemove, 
  MdRefresh, 
  MdShield, 
  MdVerifiedUser, 
  MdStorage,
  MdCheckCircle,
  MdSmokingRooms,
  MdCoffee,
  MdRestaurant,
  MdWaterDrop,
  MdSmartphone,
  MdLaptop,
  MdTv,
  MdBackspace,
  MdSecurity
} from 'react-icons/md';
import { useStore } from './store';
import { cn, formatCurrency } from './lib/utils';
import { format, startOfToday, isSameDay, addDays, isWithinInterval, startOfWeek, startOfMonth, endOfDay } from 'date-fns';

// --- Icon Mapping ---
const getCategoryIcon = (category: string) => {
  switch (category) {
    case 'Tobacco': return <MdSmokingRooms size={14} />;
    case 'Beverage': return <MdCoffee size={14} />;
    case 'Food': return <MdRestaurant size={14} />;
    case 'Dairy': return <MdWaterDrop size={14} />;
    default: return <MdInventory2 size={14} />;
  }
};

// --- Components ---

const Logo = ({ size = 24, className }: { size?: number, className?: string }) => (
  <div className={cn("relative flex items-center justify-center bg-slate-900 dark:bg-white rounded-xl", className)} style={{ width: size, height: size }}>
    <div className="flex flex-col gap-[3px]">
      <div className="w-[14px] h-[2.5px] bg-white dark:bg-slate-900 rounded-full" />
      <div className="w-[18px] h-[2.5px] bg-white dark:bg-slate-900 rounded-full" />
      <div className="w-[12px] h-[2.5px] bg-white dark:bg-slate-900 rounded-full" />
    </div>
  </div>
);

const TopBar = ({ onProfileClick }: { onProfileClick: () => void }) => {
  const { user, theme, toggleTheme } = useStore();
  if (!user) return null;

  return (
    <header className="fixed top-0 left-0 right-0 z-40 max-w-md mx-auto bg-white dark:bg-slate-950 border-b border-slate-100 dark:border-slate-900 px-4 h-10 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <Logo size={24} className="rounded-md" />
        <div>
          <p className="text-[6px] font-bold text-slate-400 uppercase tracking-widest mb-0 leading-none">Welcome back</p>
          <h2 className="text-[10px] font-black tracking-tight text-slate-900 dark:text-white leading-none">{user.name}</h2>
        </div>
      </div>
      <div className="flex items-center gap-1">
        <button 
          onClick={toggleTheme}
          className="w-7 h-7 flex items-center justify-center text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
        >
          {theme === 'light' ? <MdDarkMode size={16} /> : <MdLightMode size={16} />}
        </button>
        <button 
          onClick={onProfileClick}
          className="w-7 h-7 rounded-md bg-slate-50 dark:bg-slate-900 flex items-center justify-center text-slate-900 dark:text-white font-bold text-[8px] border border-slate-100 dark:border-slate-800"
        >
          {user.name.split(' ').map(n => n[0]).join('').toUpperCase()}
        </button>
      </div>
    </header>
  );
};

const ProfilePanel = ({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) => {
  const { user, logout } = useStore();
  if (!user) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-[60]"
          />
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 bottom-0 w-full max-w-[240px] bg-white dark:bg-slate-950 z-[70] shadow-2xl p-5 flex flex-col"
          >
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-sm font-black tracking-tight text-slate-900 dark:text-white">Account</h3>
              <button onClick={onClose} className="w-7 h-7 flex items-center justify-center rounded-lg bg-slate-50 dark:bg-slate-900 text-slate-400">
                <MdClose size={18} />
              </button>
            </div>

            <div className="flex flex-col items-center text-center mb-8">
              <div className="w-12 h-12 rounded-2xl bg-slate-900 dark:bg-white flex items-center justify-center text-white dark:text-slate-900 text-lg font-black mb-3 shadow-lg shadow-slate-200 dark:shadow-none">
                {user.name.split(' ').map(n => n[0]).join('').toUpperCase()}
              </div>
              <h3 className="text-base font-black text-slate-900 dark:text-white mb-1 tracking-tight">{user.name}</h3>
              <div className="px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-900 text-[8px] font-black uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
                {user.role}
              </div>
            </div>

            <div className="flex flex-col gap-4 flex-1">
              <div className="space-y-3">
                <div className="flex items-center justify-between border-b border-slate-50 dark:border-slate-900 pb-2">
                  <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">User ID</span>
                  <span className="text-[10px] font-bold text-slate-900 dark:text-slate-100">#{user.id}</span>
                </div>
                <div className="flex items-center justify-between border-b border-slate-50 dark:border-slate-900 pb-2">
                  <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Status</span>
                  <span className="text-[10px] font-bold text-emerald-500">Verified</span>
                </div>
              </div>
            </div>

            <button 
              onClick={() => {
                onClose();
                logout();
              }}
              className="w-full h-10 rounded-lg bg-rose-50 dark:bg-rose-900/20 text-rose-500 text-[9px] font-black uppercase tracking-widest flex items-center justify-center gap-2"
            >
              <MdLogout size={14} />
              Sign Out
            </button>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

const Button = ({ 
  children, 
  className, 
  variant = 'primary', 
  ...props 
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'primary' | 'secondary' | 'outline' | 'ghost' }) => {
  const variants = {
    primary: 'bg-accent text-white shadow-lg shadow-accent/20 hover:shadow-accent/30',
    secondary: 'bg-slate-100 text-slate-900 hover:bg-slate-200',
    outline: 'bg-transparent border-2 border-slate-100 text-slate-600 hover:border-slate-200',
    ghost: 'bg-transparent text-slate-500 hover:text-accent'
  };
  
  return (
    <motion.button
      whileTap={{ scale: 0.97 }}
      className={cn(
        'h-10 px-4 rounded-xl font-bold flex items-center justify-center transition-all text-xs',
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
    </motion.button>
  );
};

const Card = ({ title, value, icon: Icon, subtitle, color = 'primary', className, children }: any) => {
  const colors = {
    primary: 'bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800',
    danger: 'bg-rose-50 dark:bg-rose-900/10 border-rose-100 dark:border-rose-900/20',
    neutral: 'bg-slate-50 dark:bg-slate-900 border-slate-100 dark:border-slate-800'
  };

  const textColors = {
    primary: 'text-slate-900 dark:text-white',
    danger: 'text-rose-600 dark:text-rose-400',
    neutral: 'text-slate-900 dark:text-white'
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "p-2.5 rounded-xl border transition-all", 
        colors[color as keyof typeof colors] || colors.primary, 
        className
      )}
    >
      <div className="flex items-center justify-between mb-1.5">
        <div className={cn(
          "w-6 h-6 rounded-lg flex items-center justify-center", 
          color === 'danger' ? 'bg-rose-100 dark:bg-rose-900/30' : 'bg-slate-50 dark:bg-slate-800',
          textColors[color as keyof typeof textColors] || textColors.primary
        )}>
          {Icon && <Icon size={12} />}
        </div>
        {subtitle && <span className="text-[7px] font-black text-slate-400 uppercase tracking-widest">{subtitle}</span>}
      </div>
      <div className="flex flex-col">
        <span className="text-[7px] font-black text-slate-400 uppercase tracking-[0.2em] mb-0">{title}</span>
        {value !== undefined && (
          <span className={cn("text-base font-black tracking-tight", textColors[color as keyof typeof textColors] || textColors.primary)}>
            {value}
          </span>
        )}
        {children}
      </div>
    </motion.div>
  );
};

const Modal = ({ isOpen, onClose, title, children }: any) => (
  <AnimatePresence>
    {isOpen && (
      <>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-40"
        />
        <motion.div
          initial={{ y: '100%' }}
          animate={{ y: 0 }}
          exit={{ y: '100%' }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className="fixed bottom-0 left-0 right-0 bg-white dark:bg-slate-950 rounded-t-[24px] z-50 p-4 shadow-2xl max-h-[90vh] overflow-y-auto border-t border-slate-100 dark:border-slate-900"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-base font-black tracking-tight text-slate-900 dark:text-white">{title}</h2>
            <button onClick={onClose} className="w-7 h-7 flex items-center justify-center rounded-lg bg-slate-50 dark:bg-slate-900 text-slate-400">
              <MdClose size={18} />
            </button>
          </div>
          {children}
        </motion.div>
      </>
    )}
  </AnimatePresence>
);

// --- Screens ---

const LoginScreen = () => {
  const [pin, setPin] = useState('');
  const [error, setError] = useState(false);
  const { setUser } = useStore();

  const handleKeyPress = (num: string) => {
    if (pin.length < 4) setPin(prev => prev + num);
  };

  const handleDelete = () => setPin(prev => prev.slice(0, -1));

  useEffect(() => {
    if (pin.length === 4) {
      const login = async () => {
        try {
          const res = await fetch('/api/auth/pin-login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ pin })
          });
          const data = await res.json();
          if (data.success) {
            setUser(data.user, data.token);
          } else {
            setError(true);
            setTimeout(() => setError(false), 500);
            setPin('');
          }
        } catch (err) {
          setError(true);
          setTimeout(() => setError(false), 500);
          setPin('');
        }
      };
      login();
    }
  }, [pin, setUser]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-white dark:bg-slate-950 transition-colors">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-[240px] flex flex-col items-center"
      >
        <div className="mb-8 text-center">
          <Logo size={48} className="rounded-xl mb-3 mx-auto shadow-lg shadow-slate-200 dark:shadow-none" />
          <h1 className="text-xl font-black tracking-tighter mb-0.5 text-slate-900 dark:text-white">EasyMoney</h1>
          <p className="text-slate-400 text-[7px] font-black tracking-[0.3em] uppercase">Secure Access</p>
        </div>

        <div className="flex gap-2.5 mb-10">
          {[0, 1, 2, 3].map(i => (
            <motion.div
              key={i}
              animate={pin.length > i ? { scale: 1.2, backgroundColor: '#0F172A' } : { scale: 1, backgroundColor: '#F1F5F9' }}
              className={cn(
                "w-1.5 h-1.5 rounded-full transition-all duration-300",
                pin.length > i ? "dark:bg-white" : "dark:bg-slate-800"
              )}
            />
          ))}
        </div>

        <div className="grid grid-cols-3 gap-3 w-full">
          {['1', '2', '3', '4', '5', '6', '7', '8', '9', '', '0', 'del'].map((key, i) => (
            <motion.button
              key={i}
              whileTap={{ scale: 0.85 }}
              onClick={() => key === 'del' ? handleDelete() : key && handleKeyPress(key)}
              className={cn(
                "h-10 flex items-center justify-center text-base font-black rounded-lg transition-all",
                key === '' ? "invisible" : "bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white active:bg-slate-200 dark:active:bg-slate-800"
              )}
            >
              {key === 'del' ? <MdBackspace size={16} /> : key}
            </motion.button>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

const Dashboard = () => {
  const { items, sales, debtors } = useStore();
  const [isSellModalOpen, setIsSellModalOpen] = useState(false);
  const [isRestockModalOpen, setIsRestockModalOpen] = useState(false);
  
  const todaySales = sales.filter(s => isSameDay(new Date(s.timestamp), startOfToday()));
  const todayTotal = todaySales.reduce((acc, s) => acc + s.total, 0);
  const pendingDebts = debtors.filter(d => d.status === 'pending').reduce((acc, d) => acc + d.amount, 0);

  return (
    <div className="p-4 pt-16">
      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        <button 
          onClick={() => setIsSellModalOpen(true)}
          className="group relative h-16 rounded-xl bg-slate-900 dark:bg-white overflow-hidden transition-all active:scale-95"
        >
          <div className="relative flex flex-col items-center justify-center gap-1">
            <div className="w-7 h-7 rounded-lg bg-white/10 dark:bg-slate-900/10 flex items-center justify-center text-white dark:text-slate-900">
              <MdAdd size={18} />
            </div>
            <span className="text-[8px] font-black uppercase tracking-widest text-white dark:text-slate-900">New Sale</span>
          </div>
        </button>
        <button 
          onClick={() => setIsRestockModalOpen(true)}
          className="group relative h-16 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 overflow-hidden transition-all active:scale-95"
        >
          <div className="relative flex flex-col items-center justify-center gap-1">
            <div className="w-7 h-7 rounded-lg bg-white dark:bg-slate-900 flex items-center justify-center text-slate-900 dark:text-white shadow-sm">
              <MdInventory2 size={18} />
            </div>
            <span className="text-[8px] font-black uppercase tracking-widest text-slate-900 dark:text-white">Restock</span>
          </div>
        </button>
      </div>

      {/* Bento Grid */}
      <div className="grid grid-cols-2 gap-3 mb-8">
        <Card 
          title="Revenue" 
          value={formatCurrency(todayTotal)} 
          icon={MdTrendingUp} 
          subtitle="Today" 
          className="col-span-2"
        />
        <Card 
          title="Debts" 
          value={formatCurrency(pendingDebts)} 
          icon={MdAccessTime} 
          subtitle="Pending" 
          color="danger" 
        />
        <Card 
          title="Stock" 
          value={items.length.toString()} 
          icon={MdInventory2} 
          subtitle="Items" 
          color="neutral"
        />
      </div>

      {/* Inventory List */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between px-1">
          <h3 className="text-[8px] font-black text-slate-400 uppercase tracking-[0.3em]">Live Inventory</h3>
          <span className="text-[8px] font-black text-slate-900 dark:text-white uppercase tracking-widest">{items.length} SKUs</span>
        </div>
        <div className="flex flex-col">
          {items.map(item => (
            <div key={item.id} className="row-item group py-2">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-slate-50 dark:bg-slate-900 flex items-center justify-center text-slate-900 dark:text-white border border-slate-100 dark:border-slate-800">
                  {getCategoryIcon(item.category)}
                </div>
                <div>
                  <div className="text-[11px] font-black text-slate-900 dark:text-white tracking-tight">{item.name}</div>
                  <div className="text-[8px] font-bold text-slate-400 uppercase tracking-wider">{formatCurrency(item.price)}</div>
                </div>
              </div>
              <div className="text-right">
                <div className={cn("text-xs font-black tracking-tighter", item.stock < 10 ? "text-rose-500" : "text-slate-900 dark:text-white")}>
                  {item.stock}
                </div>
                <div className="text-[7px] uppercase font-black text-slate-400 tracking-widest">Units</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <SellModal isOpen={isSellModalOpen} onClose={() => setIsSellModalOpen(false)} />
      <RestockModal isOpen={isRestockModalOpen} onClose={() => setIsRestockModalOpen(false)} />
    </div>
  );
};

const SellModal = ({ isOpen, onClose }: any) => {
  const { items, setSales, setItems, setDebtors } = useStore();
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [quantity, setQuantity] = useState(1);
  const [paymentType, setPaymentType] = useState<'cash' | 'plb' | 'debt'>('cash');
  const [customerName, setCustomerName] = useState('');

  const handleConfirm = async () => {
    if (!selectedItem) return;
    
    const sale = {
      item_id: selectedItem.id,
      quantity,
      total: selectedItem.price * quantity,
      payment_type: paymentType,
      customer_name: paymentType === 'debt' ? customerName : undefined,
      timestamp: new Date().toISOString()
    };

    try {
      await fetch('/api/sales', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(sale)
      });
      
      if (paymentType === 'debt') {
        await fetch('/api/debtors', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            customer_name: customerName,
            amount: selectedItem.price * quantity,
            due_date: format(addDays(new Date(), 7), 'yyyy-MM-dd'),
            status: 'pending'
          })
        });
        const debtorsRes = await fetch('/api/debtors');
        setDebtors(await debtorsRes.json());
      }
      
      const [itemsRes, salesRes] = await Promise.all([
        fetch('/api/items'),
        fetch('/api/sales')
      ]);
      setItems(await itemsRes.json());
      setSales(await salesRes.json());

      onClose();
      setSelectedItem(null);
      setQuantity(1);
      setPaymentType('cash');
      setCustomerName('');
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="New Sale">
      {!selectedItem ? (
        <div className="flex flex-col">
          {items.map(item => (
            <button
              key={item.id}
              onClick={() => setSelectedItem(item)}
              className="row-item hover:bg-slate-50 dark:hover:bg-slate-900 transition-all py-2"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-slate-50 dark:bg-slate-900 flex items-center justify-center text-slate-900 dark:text-white border border-slate-100 dark:border-slate-800">
                  {getCategoryIcon(item.category)}
                </div>
                <div className="text-left">
                  <div className="text-[11px] font-black text-slate-900 dark:text-white tracking-tight">{item.name}</div>
                  <div className="text-[8px] font-bold text-slate-400 uppercase tracking-wider">{formatCurrency(item.price)}</div>
                </div>
              </div>
              <div className="text-slate-300">
                <MdChevronRight size={14} />
              </div>
            </button>
          ))}
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800">
            <div className="w-8 h-8 rounded-lg bg-white dark:bg-slate-800 flex items-center justify-center text-slate-900 dark:text-white shadow-sm">
              {getCategoryIcon(selectedItem.category)}
            </div>
            <div className="flex-1">
              <div className="text-xs font-black text-slate-900 dark:text-white tracking-tight">{selectedItem.name}</div>
              <div className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">{formatCurrency(selectedItem.price)}</div>
            </div>
            <button onClick={() => setSelectedItem(null)} className="text-[8px] font-black uppercase text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors">Change</button>
          </div>

          <div className="flex flex-col gap-2">
            <span className="text-[8px] font-black uppercase text-slate-400 tracking-[0.2em] px-1">Quantity</span>
            <div className="flex items-center justify-between bg-slate-50 dark:bg-slate-900 rounded-xl p-1.5 border border-slate-100 dark:border-slate-800">
              <button onClick={() => setQuantity(q => Math.max(1, q - 1))} className="w-8 h-8 flex items-center justify-center bg-white dark:bg-slate-800 rounded-lg shadow-sm text-slate-400 hover:text-slate-900 dark:hover:text-white transition-all"><MdRemove size={16} /></button>
              <span className="text-lg font-black text-slate-900 dark:text-white">{quantity}</span>
              <button onClick={() => setQuantity(q => q + 1)} className="w-8 h-8 flex items-center justify-center bg-white dark:bg-slate-800 rounded-lg shadow-sm text-slate-400 hover:text-slate-900 dark:hover:text-white transition-all"><MdAdd size={16} /></button>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <span className="text-[8px] font-black uppercase text-slate-400 tracking-[0.2em] px-1">Payment Method</span>
            <div className="grid grid-cols-3 gap-2">
              {(['cash', 'plb', 'debt'] as const).map((type) => (
                <button
                  key={type}
                  onClick={() => setPaymentType(type)}
                  className={cn(
                    "h-10 rounded-lg text-[8px] font-black uppercase tracking-widest transition-all border-2",
                    paymentType === type 
                      ? "bg-slate-900 border-slate-900 text-white dark:bg-white dark:border-white dark:text-slate-900" 
                      : "bg-transparent border-slate-100 dark:border-slate-800 text-slate-400"
                  )}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          {paymentType === 'debt' && (
            <div className="flex flex-col gap-2">
              <span className="text-[8px] font-black uppercase text-slate-400 tracking-[0.2em] px-1">Customer Info</span>
              <input 
                placeholder="Full Name" 
                className="w-full h-10 bg-slate-50 dark:bg-slate-900 border-2 border-slate-100 dark:border-slate-800 rounded-lg px-3 text-[10px] font-black text-slate-900 dark:text-white focus:border-slate-900 dark:focus:border-white transition-all outline-none"
                value={customerName}
                onChange={e => setCustomerName(e.target.value)}
              />
            </div>
          )}

          <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Total Amount</span>
              <span className="text-xl font-black text-slate-900 dark:text-white tracking-tighter">{formatCurrency(selectedItem.price * quantity)}</span>
            </div>
            <Button onClick={handleConfirm} className="w-full h-12 text-[9px] uppercase bg-slate-900 dark:bg-white text-white dark:text-slate-900">Confirm Sale</Button>
          </div>
        </div>
      )}
    </Modal>
  );
};

const RestockModal = ({ isOpen, onClose }: any) => {
  const { items, setItems } = useStore();
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [quantity, setQuantity] = useState(1);

  const handleConfirm = async () => {
    if (!selectedItem) return;
    try {
      await fetch('/api/restocks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ item_id: selectedItem.id, quantity })
      });
      const res = await fetch('/api/items');
      setItems(await res.json());
      onClose();
      setSelectedItem(null);
      setQuantity(1);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Restock">
      {!selectedItem ? (
        <div className="flex flex-col">
          <label className="text-[8px] font-black text-slate-400 uppercase tracking-[0.3em] mb-2 px-1">Select Item</label>
          {items.map(item => (
            <button
              key={item.id}
              onClick={() => setSelectedItem(item)}
              className="row-item hover:bg-slate-50 dark:hover:bg-slate-900 transition-all py-2"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-slate-50 dark:bg-slate-900 flex items-center justify-center text-slate-900 dark:text-white border border-slate-100 dark:border-slate-800">
                  {getCategoryIcon(item.category)}
                </div>
                <div className="text-left">
                  <div className="text-[11px] font-black text-slate-900 dark:text-white tracking-tight">{item.name}</div>
                  <div className="text-[8px] font-bold text-slate-400 uppercase tracking-wider">Stock: {item.stock}</div>
                </div>
              </div>
              <div className="text-slate-300">
                <MdChevronRight size={14} />
              </div>
            </button>
          ))}
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800">
            <div className="w-8 h-8 rounded-lg bg-white dark:bg-slate-800 flex items-center justify-center text-slate-900 dark:text-white shadow-sm">
              {getCategoryIcon(selectedItem.category)}
            </div>
            <div className="flex-1">
              <div className="text-xs font-black text-slate-900 dark:text-white tracking-tight">{selectedItem.name}</div>
              <div className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Current: {selectedItem.stock}</div>
            </div>
            <button onClick={() => setSelectedItem(null)} className="text-[8px] font-black uppercase text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors">Change</button>
          </div>

          <div className="flex flex-col gap-2">
            <span className="text-[8px] font-black uppercase text-slate-400 tracking-[0.2em] px-1">Add Quantity</span>
            <div className="flex items-center justify-between bg-slate-50 dark:bg-slate-900 rounded-xl p-1.5 border border-slate-100 dark:border-slate-800">
              <button onClick={() => setQuantity(q => Math.max(1, q - 1))} className="w-8 h-8 flex items-center justify-center bg-white dark:bg-slate-800 rounded-lg shadow-sm text-slate-400 hover:text-slate-900 dark:hover:text-white transition-all"><MdRemove size={16} /></button>
              <span className="text-lg font-black text-slate-900 dark:text-white">{quantity}</span>
              <button onClick={() => setQuantity(q => q + 1)} className="w-8 h-8 flex items-center justify-center bg-white dark:bg-slate-800 rounded-lg shadow-sm text-slate-400 hover:text-slate-900 dark:hover:text-white transition-all"><MdAdd size={16} /></button>
            </div>
          </div>

          <Button onClick={handleConfirm} className="w-full h-12 text-[9px] uppercase bg-slate-900 dark:bg-white text-white dark:text-slate-900 mt-2">Update Stock</Button>
        </div>
      )}
    </Modal>
  );
};

const ManagementScreen = () => {
  const { items, sales } = useStore();
  const [activeTab, setActiveTab] = useState<'inventory' | 'sales'>('inventory');
  const [salesRange, setSalesRange] = useState<'today' | 'week' | 'month'>('today');
  const [isRestockModalOpen, setIsRestockModalOpen] = useState(false);

  const filteredSales = sales.filter(s => {
    const date = new Date(s.timestamp);
    const now = new Date();
    if (salesRange === 'today') return isSameDay(date, startOfToday());
    if (salesRange === 'week') return isWithinInterval(date, { start: startOfWeek(now), end: endOfDay(now) });
    if (salesRange === 'month') return isWithinInterval(date, { start: startOfMonth(now), end: endOfDay(now) });
    return true;
  }).sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

  const getItemName = (id: string) => items.find(i => i.id === id)?.name || 'Unknown Item';

  return (
    <div className="p-4 pb-32 pt-16 min-h-screen bg-white dark:bg-slate-950 transition-colors">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-black tracking-tight text-slate-900 dark:text-white">Management</h2>
        <div className="flex bg-slate-50 dark:bg-slate-900 p-0.5 rounded-lg border border-slate-100 dark:border-slate-800">
          <button 
            onClick={() => setActiveTab('inventory')}
            className={cn(
              "px-3 py-1 rounded-md text-[8px] font-black uppercase tracking-widest transition-all",
              activeTab === 'inventory' ? "bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm" : "text-slate-400"
            )}
          >
            Stock
          </button>
          <button 
            onClick={() => setActiveTab('sales')}
            className={cn(
              "px-3 py-1 rounded-md text-[8px] font-black uppercase tracking-widest transition-all",
              activeTab === 'sales' ? "bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm" : "text-slate-400"
            )}
          >
            Sales
          </button>
        </div>
      </div>

      {activeTab === 'inventory' ? (
        <div className="flex flex-col">
          <div className="flex items-center justify-between mb-3 px-1">
            <span className="text-[8px] font-black text-slate-400 uppercase tracking-[0.3em]">Inventory</span>
            <button 
              onClick={() => setIsRestockModalOpen(true)}
              className="w-7 h-7 rounded-lg bg-slate-900 dark:bg-white text-white dark:text-slate-900 flex items-center justify-center hover:scale-95 transition-all"
            >
              <MdAdd size={18} />
            </button>
          </div>
          {items.map(item => (
            <div key={item.id} className="row-item py-2">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-slate-50 dark:bg-slate-900 flex items-center justify-center text-slate-900 dark:text-white border border-slate-100 dark:border-slate-800">
                  {getCategoryIcon(item.category)}
                </div>
                <div>
                  <div className="text-[11px] font-black text-slate-900 dark:text-white tracking-tight">{item.name}</div>
                  <div className="flex items-center gap-2 mt-0.5">
                    <div className="w-16 h-0.5 bg-slate-50 dark:bg-slate-900 rounded-full overflow-hidden border border-slate-100 dark:border-slate-800">
                      <div 
                        className={cn("h-full transition-all", item.stock < 10 ? "bg-rose-500" : "bg-slate-900 dark:bg-white")}
                        style={{ width: `${Math.min(100, (item.stock / 100) * 100)}%` }}
                      />
                    </div>
                    <span className={cn("text-[8px] font-black", item.stock < 10 ? "text-rose-500" : "text-slate-400")}>
                      {item.stock}
                    </span>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-[11px] font-black text-slate-900 dark:text-white tracking-tight">{formatCurrency(item.price)}</div>
                <div className="text-[7px] uppercase font-black text-slate-400 tracking-widest">Unit Price</div>
              </div>
            </div>
          ))}
          <RestockModal isOpen={isRestockModalOpen} onClose={() => setIsRestockModalOpen(false)} />
        </div>
      ) : (
        <div className="flex flex-col">
          <div className="flex gap-2 mb-4 overflow-x-auto pb-2 no-scrollbar">
            {['today', 'week', 'month'].map((r) => (
              <button
                key={r}
                onClick={() => setSalesRange(r as any)}
                className={cn(
                  "px-4 py-1.5 rounded-lg text-[8px] font-black uppercase tracking-widest transition-all whitespace-nowrap border",
                  salesRange === r 
                    ? "bg-slate-900 border-slate-900 text-white dark:bg-white dark:border-white dark:text-slate-900" 
                    : "bg-transparent border-slate-100 dark:border-slate-800 text-slate-400"
                )}
              >
                {r}
              </button>
            ))}
          </div>
          <div className="flex flex-col">
            {filteredSales.map((sale) => (
              <div key={sale.id} className="row-item py-2">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-slate-50 dark:bg-slate-900 flex items-center justify-center text-slate-900 dark:text-white border border-slate-100 dark:border-slate-800">
                    <MdHistory size={16} />
                  </div>
                  <div>
                    <div className="text-[11px] font-black text-slate-900 dark:text-white tracking-tight">{getItemName(sale.item_id)}</div>
                    <div className="text-[8px] font-bold text-slate-400 uppercase tracking-wider">{format(new Date(sale.timestamp), 'HH:mm')} • {sale.payment_type}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-[11px] font-black text-slate-900 dark:text-white tracking-tight">{formatCurrency(sale.total)}</div>
                  <div className="text-[7px] uppercase font-black text-slate-400 tracking-widest">{sale.quantity} Units</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const DebtorsScreen = () => {
  const { debtors, setDebtors } = useStore();

  const handleMarkPaid = async (id: string) => {
    try {
      await fetch(`/api/debtors/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'paid' })
      });
      const res = await fetch('/api/debtors');
      setDebtors(await res.json());
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="p-4 pb-32 pt-16 min-h-screen bg-white dark:bg-slate-950 transition-colors">
      <h2 className="text-lg font-black tracking-tight text-slate-900 dark:text-white mb-6">Debtors</h2>
      <div className="flex flex-col">
        {debtors.filter(d => d.status === 'pending').map(debtor => (
          <div key={debtor.id} className="row-item flex-col items-start gap-2 p-3">
            <div className="w-full flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-rose-50 dark:bg-rose-900/20 flex items-center justify-center text-rose-500 border border-rose-100 dark:border-rose-900/30">
                  <MdAccessTime size={16} />
                </div>
                <div>
                  <div className="text-[11px] font-black text-slate-900 dark:text-white tracking-tight">{debtor.customer_name}</div>
                  <div className="text-[8px] font-bold text-slate-400 uppercase tracking-wider">Due: {debtor.due_date}</div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm font-black text-rose-500 tracking-tighter">{formatCurrency(debtor.amount)}</div>
                <div className="text-[7px] uppercase font-black text-slate-400 tracking-widest">Pending</div>
              </div>
            </div>
            <Button onClick={() => handleMarkPaid(debtor.id)} className="w-full h-8 text-[8px] uppercase bg-slate-900 dark:bg-white text-white dark:text-slate-900">Settle Debt</Button>
          </div>
        ))}
        {debtors.filter(d => d.status === 'pending').length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-slate-200 dark:text-slate-800">
            <div className="mb-3 opacity-20">
              <MdCheckCircle size={40} />
            </div>
            <p className="text-[8px] font-black uppercase tracking-[0.3em]">Clean Slate</p>
          </div>
        )}
      </div>
    </div>
  );
};

const CustomersScreen = () => {
  const { sales, debtors } = useStore();
  
  const customerMap = new Map();
  sales.forEach(s => {
    if (s.customer_name) {
      const existing = customerMap.get(s.customer_name) || { spent: 0, owed: 0, transactions: 0 };
      existing.spent += s.total;
      existing.transactions += 1;
      customerMap.set(s.customer_name, existing);
    }
  });
  debtors.forEach(d => {
    const existing = customerMap.get(d.customer_name) || { spent: 0, owed: 0, transactions: 0 };
    if (d.status === 'pending') existing.owed += d.amount;
    customerMap.set(d.customer_name, existing);
  });

  const customers = Array.from(customerMap.entries()).map(([name, data]) => ({ name, ...data }));

  return (
    <div className="p-4 pb-32 pt-16 min-h-screen bg-white dark:bg-slate-950 transition-colors">
      <h2 className="text-lg font-black tracking-tight text-slate-900 dark:text-white mb-6">Customers</h2>
      <div className="flex flex-col">
        {customers.map((customer, i) => (
          <div key={i} className="row-item py-2">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-slate-50 dark:bg-slate-900 flex items-center justify-center text-slate-900 dark:text-white border border-slate-100 dark:border-slate-800 font-black text-xs">
                {customer.name[0]}
              </div>
              <div>
                <div className="text-[11px] font-black text-slate-900 dark:text-white tracking-tight">{customer.name}</div>
                <div className="text-[8px] font-bold text-slate-400 uppercase tracking-wider">{customer.transactions} Orders</div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-[11px] font-black text-slate-900 dark:text-white tracking-tight">{formatCurrency(customer.spent)}</div>
              {customer.owed > 0 && <div className="text-[7px] text-rose-500 font-black uppercase tracking-widest">Owes {formatCurrency(customer.owed)}</div>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const DeveloperConsole = () => {
  const { systemData } = useStore();
  const [activeSection, setActiveSection] = useState<'deployments' | 'updates' | 'notifications' | 'settings'>('deployments');

  if (!systemData) return <div className="p-6 text-center text-slate-400 text-[8px] uppercase font-black tracking-widest">Loading system data...</div>;

  return (
    <div className="p-4 pb-32 pt-16 min-h-screen bg-white dark:bg-slate-950 transition-colors">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-black tracking-tight text-slate-900 dark:text-white">Dev Console</h2>
        <div className="flex bg-slate-50 dark:bg-slate-900 p-0.5 rounded-lg border border-slate-100 dark:border-slate-800 overflow-x-auto no-scrollbar">
          {(['deployments', 'updates', 'notifications', 'settings'] as const).map((section) => (
            <button
              key={section}
              onClick={() => setActiveSection(section)}
              className={cn(
                "px-3 py-1 rounded-md text-[8px] font-black uppercase tracking-widest transition-all whitespace-nowrap",
                activeSection === section 
                  ? "bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm" 
                  : "text-slate-400"
              )}
            >
              {section}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-col">
        {activeSection === 'deployments' && (
          <>
            <div className="flex items-center justify-between mb-3 px-1">
              <span className="text-[8px] font-black text-slate-400 uppercase tracking-[0.3em]">History</span>
              <span className="text-[8px] font-black text-emerald-500 uppercase tracking-widest">Live</span>
            </div>
            {systemData.deployments.map((dep) => (
              <div key={dep.id} className="row-item py-2">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-slate-50 dark:bg-slate-900 flex items-center justify-center text-slate-400 border border-slate-100 dark:border-slate-800">
                    <MdRefresh size={16} />
                  </div>
                  <div>
                    <div className="text-[11px] font-black text-slate-900 dark:text-white tracking-tight">{dep.version}</div>
                    <div className="text-[8px] font-bold text-slate-400 uppercase tracking-wider">{dep.notes}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-[8px] font-black text-emerald-500 uppercase mb-0.5">{dep.status}</div>
                  <div className="text-[7px] text-slate-400 uppercase font-black tracking-widest">{format(new Date(dep.timestamp), 'MMM d')}</div>
                </div>
              </div>
            ))}
          </>
        )}

        {activeSection === 'updates' && (
          <>
            <div className="flex items-center justify-between mb-3 px-1">
              <span className="text-[8px] font-black text-slate-400 uppercase tracking-[0.3em]">System Updates</span>
            </div>
            {systemData.updates.map((update) => (
              <div key={update.id} className="row-item flex-col items-start gap-1.5 p-3">
                <div className="w-full flex items-center justify-between">
                  <div className="text-[11px] font-black text-slate-900 dark:text-white tracking-tight">{update.title}</div>
                  <div className="text-[7px] text-slate-400 uppercase font-black tracking-widest">{format(new Date(update.timestamp), 'MMM d')}</div>
                </div>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-relaxed font-medium">{update.description}</p>
              </div>
            ))}
          </>
        )}

        {activeSection === 'notifications' && (
          <>
            <div className="flex items-center justify-between mb-3 px-1">
              <span className="text-[8px] font-black text-slate-400 uppercase tracking-[0.3em]">Technical Alerts</span>
            </div>
            {systemData.notifications.map((notif) => (
              <div key={notif.id} className="row-item gap-3 py-2">
                <div className={cn(
                  "w-8 h-8 rounded-lg flex items-center justify-center border",
                  notif.type === 'warning' ? "bg-rose-50 border-rose-100 text-rose-500 dark:bg-rose-900/20 dark:border-rose-900/30" : "bg-blue-50 border-blue-100 text-blue-500 dark:bg-blue-900/20 dark:border-blue-900/30"
                )}>
                  <MdSecurity size={16} />
                </div>
                <div className="flex-1">
                  <p className="text-[10px] text-slate-900 dark:text-white font-black leading-snug mb-0.5">{notif.message}</p>
                  <div className="text-[7px] text-slate-400 uppercase font-black tracking-widest">{format(new Date(notif.timestamp), 'HH:mm:ss')}</div>
                </div>
              </div>
            ))}
          </>
        )}

        {activeSection === 'settings' && (
          <div className="flex flex-col gap-4">
            <div className="flex flex-col">
              <h3 className="text-[8px] font-black text-slate-400 uppercase tracking-[0.3em] mb-3 px-1">Technical Toggles</h3>
              <div className="flex flex-col">
                {[
                  { label: 'Debug Mode', icon: MdTerminal, active: true },
                  { label: 'Maintenance Mode', icon: MdSecurity, active: false },
                  { label: 'API Logging', icon: MdStorage, active: true }
                ].map((item, i) => (
                  <div key={i} className="row-item py-2">
                    <div className="flex items-center gap-3">
                      <div className="w-7 h-7 rounded-lg bg-slate-50 dark:bg-slate-900 flex items-center justify-center text-slate-400 border border-slate-100 dark:border-slate-800">
                        <item.icon size={14} />
                      </div>
                      <span className="text-[10px] font-black text-slate-900 dark:text-white uppercase tracking-wider">{item.label}</span>
                    </div>
                    <div className={cn(
                      "w-8 h-4 rounded-full relative transition-all cursor-pointer",
                      item.active ? "bg-slate-900 dark:bg-white" : "bg-slate-200 dark:bg-slate-800"
                    )}>
                      <div className={cn(
                        "absolute top-0.5 w-3 h-3 bg-white dark:bg-slate-900 rounded-full transition-all",
                        item.active ? "right-0.5" : "left-0.5"
                      )} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex flex-col">
              <h3 className="text-[8px] font-black text-slate-400 uppercase tracking-[0.3em] mb-3 px-1">System Info</h3>
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-[8px] text-slate-400 font-black uppercase tracking-widest">Build Number</span>
                  <span className="text-[10px] text-slate-900 dark:text-white font-black">{systemData.build}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[8px] text-slate-400 font-black uppercase tracking-widest">Server Uptime</span>
                  <span className="text-[10px] text-slate-900 dark:text-white font-black">{systemData.uptime}</span>
                </div>
                <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
                  <button className="w-full py-1.5 rounded-lg bg-white dark:bg-slate-800 text-[8px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-900 dark:hover:text-white transition-all shadow-sm">
                    Clear Local Cache
                  </button>
                </div>
              </div>
            </div>
            <Button className="w-full h-10 text-[9px] uppercase bg-rose-500 text-white hover:bg-rose-600">Force System Restart</Button>
          </div>
        )}
      </div>
    </div>
  );
};

// --- Main App ---

const Navigation = ({ activeTab, setActiveTab, user, logout }: any) => {
  const navTabs = [
    { id: 'dashboard', icon: MdDashboard, label: 'Home' },
    { id: 'management', icon: MdInventory, label: 'Manage' },
    { id: 'debtors', icon: MdAccessTime, label: 'Debts' },
    { id: 'customers', icon: MdPeople, label: 'Users', roles: ['admin', 'developer'] },
    { id: 'developer', icon: MdTerminal, label: 'Dev', roles: ['developer'] }
  ].filter(tab => !tab.roles || tab.roles.includes(user.role));

  return (
    <nav className="fixed bottom-4 left-1/2 -translate-x-1/2 w-[calc(100%-32px)] max-w-[320px] bg-slate-900 dark:bg-white backdrop-blur-xl border border-white/10 dark:border-slate-200 shadow-2xl rounded-2xl z-50 overflow-hidden">
      <div className="flex items-center justify-around h-12 px-1">
        {navTabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              "relative flex flex-col items-center justify-center gap-0.5 w-10 h-10 transition-all duration-300 rounded-lg",
              activeTab === tab.id 
                ? "text-white dark:text-slate-900 bg-white/10 dark:bg-slate-100" 
                : "text-slate-500 hover:text-slate-300 dark:hover:text-slate-700"
            )}
          >
            <tab.icon size={16} />
            <span className="text-[6px] font-black uppercase tracking-widest leading-none">{tab.label}</span>
          </button>
        ))}
        <div className="w-px h-5 bg-white/10 dark:bg-slate-200 mx-0.5" />
        <button 
          onClick={logout}
          className="flex flex-col items-center justify-center gap-0.5 w-10 h-10 text-rose-500 hover:bg-rose-500/10 rounded-lg transition-all"
        >
          <MdLogout size={16} />
          <span className="text-[6px] font-black uppercase tracking-widest leading-none">Exit</span>
        </button>
      </div>
    </nav>
  );
};

export default function App() {
  const { user, theme, setItems, setSales, setDebtors, setSystemData, logout } = useStore();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  useEffect(() => {
    if (user) {
      const fetchData = async () => {
        try {
          const [itemsRes, salesRes, debtorsRes] = await Promise.all([
            fetch('/api/items'),
            fetch('/api/sales'),
            fetch('/api/debtors')
          ]);
          setItems(await itemsRes.json());
          setSales(await salesRes.json());
          setDebtors(await debtorsRes.json());

          if (user.role === 'developer') {
            const systemRes = await fetch('/api/system');
            setSystemData(await systemRes.json());
          }
        } catch (err) {
          console.error(err);
        }
      };
      fetchData();
    }
  }, [user, setItems, setSales, setDebtors, setSystemData]);

  if (!user) return <LoginScreen />;

  const renderScreen = () => {
    const canAccess = (tab: string) => {
      if (user.role === 'developer') return true;
      if (user.role === 'admin') return tab !== 'developer';
      if (user.role === 'seller') return ['dashboard', 'management', 'debtors'].includes(tab);
      return false;
    };

    if (!canAccess(activeTab)) {
      setActiveTab('dashboard');
      return <Dashboard />;
    }

    switch (activeTab) {
      case 'dashboard': return <Dashboard />;
      case 'management': return <ManagementScreen />;
      case 'debtors': return <DebtorsScreen />;
      case 'customers': return <CustomersScreen />;
      case 'developer': return <DeveloperConsole />;
      default: return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen font-sans bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 selection:bg-slate-900 selection:text-white dark:selection:bg-white dark:selection:text-slate-900">
      <div className="max-w-md mx-auto min-h-screen bg-white dark:bg-slate-900 shadow-[0_0_100px_rgba(0,0,0,0.05)] dark:shadow-none flex flex-col relative">
        <TopBar onProfileClick={() => setIsProfileOpen(true)} />
        <ProfilePanel isOpen={isProfileOpen} onClose={() => setIsProfileOpen(false)} />
        
        <main className="flex-1 pb-32">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
            >
              {renderScreen()}
            </motion.div>
          </AnimatePresence>
        </main>
        
        <Navigation activeTab={activeTab} setActiveTab={setActiveTab} user={user} logout={logout} />
      </div>
    </div>
  );
}
