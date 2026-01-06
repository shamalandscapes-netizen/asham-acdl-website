'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { 
  ArrowLeft, CreditCard, Loader2, ShieldCheck, 
  ShoppingBag, Globe, Landmark, MapPin, Construction,
  Phone, Mail, User, CheckCircle2, ChevronDown
} from 'lucide-react'; 
import { toast } from 'react-hot-toast';
import Link from 'next/link';

import { useCartStore } from '@/store/cart-store'; 
import { cn, formatCurrency, formatMpesaPhone } from '@/lib/utils';

// --- DATASET: Counties and Sub-Counties ---
const KENYA_LOCATIONS: Record<string, string[]> = {
  "Nairobi": ["Westlands", "Dagoretti North", "Dagoretti South", "Langata", "Kibra", "Roysambu", "Kasarani", "Ruaraka", "Embakasi North", "Embakasi Central", "Embakasi East", "Embakasi West", "Embakasi South", "Makadara", "Kamkunji", "Starehe", "Mathare"],
  "Mombasa": ["Changamwe", "Jomvu", "Kisauni", "Nyali", "Likoni", "Mvita"],
  "Kwale": ["Msambweni", "Lunga Lunga", "Kwale", "Kinango"],
  "Kilifi": ["Kilifi North", "Kilifi South", "Kaloleni", "Rabai", "Ganze", "Malindi", "Magarini"],
  "Tana River": ["Tana Delta", "Tana River", "Tana North"],
  "Lamu": ["Lamu East", "Lamu West"],
  "Taita Taveta": ["Taveta", "Wundanyi", "Mwatate", "Voi"],
  "Garissa": ["Garissa Township", "Balambala", "Lagdera", "Dadaab", "Fafi", "Ijara"],
  "Wajir": ["Wajir North", "Wajir East", "Wajir South", "Wajir West", "Eldas", "Tarbaj"],
  "Mandera": ["Mandera West", "Mandera North", "Mandera Central", "Mandera East", "Mandera South", "Lafey"],
  "Marsabit": ["Moyale", "Saku", "Laisamis", "North Horr"],
  "Isiolo": ["Isiolo", "Garbatulla", "Merti"],
  "Meru": ["Igembe South", "Igembe Central", "Igembe North", "Tigania West", "Tigania East", "North Imenti", "Buuri", "Central Imenti", "South Imenti"],
  "Tharaka-Nithi": ["Maara", "Chuka/Igambang'ombe", "Tharaka"],
  "Embu": ["Manyatta", "Runyenjes", "Mbeere North", "Mbeere South"],
  "Kitui": ["Mwingi North", "Mwingi West", "Mwingi Central", "Kitui West", "Kitui Rural", "Kitui Central", "Kitui East", "Kitui South"],
  "Machakos": ["Masinga", "Yatta", "Kangundo", "Matungulu", "Kathiani", "Mavoko", "Machakos Town", "Mwala"],
  "Makueni": ["Mbooni", "Kilome", "Kaiti", "Makueni", "Kibwezi West", "Kibwezi East"],
  "Nyandarua": ["Kinangop", "Kipipiri", "Ol Kalou", "Ol Joro Orok", "Ndaragwa"],
  "Nyeri": ["Tetu", "Kieni", "Mathira", "Othaya", "Mukurweini", "Nyeri Town"],
  "Kirinyaga": ["Mwea", "Gichugu", "Ndia", "Kirinyaga Central"],
  "Murang'a": ["Kangema", "Mathioya", "Kiharu", "Kigumo", "Maragua", "Kandara", "Gatanga"],
  "Kiambu": ["Gatundu South", "Gatundu North", "Githunguri", "Kiambu", "Kiambaa", "Kabete", "Kikuyu", "Limuru", "Lari", "Thika Town", "Ruiru", "Juja"],
  "Turkana": ["Turkana North", "Turkana West", "Turkana Central", "Loima", "Turkana South", "Turkana East"],
  "West Pokot": ["Kapenguria", "Sigor", "Kacheliba", "Pokot South"],
  "Samburu": ["Samburu North", "Samburu East", "Samburu West"],
  "Trans Nzoia": ["Kwanza", "Endebess", "Saboti", "Kiminini", "Cherangany"],
  "Uasin Gishu": ["Soy", "Turbo", "Moiben", "Ainabkoi", "Kapseret", "Kesses"],
  "Elgeyo-Marakwet": ["Marakwet East", "Marakwet West", "Keiyo South", "Keiyo North"],
  "Nandi": ["Tinderet", "Aldai", "Nandi Hills", "Chesumei", "Emgwen", "Mosop"],
  "Baringo": ["Tiaty", "Baringo North", "Baringo Central", "Baringo South", "Mogotio", "Eldama Ravine"],
  "Laikipia": ["Laikipia West", "Laikipia East", "Laikipia North"],
  "Nakuru": ["Molo", "Njoro", "Naivasha", "Gilgil", "Kuresoi South", "Kuresoi North", "Subukia", "Rongai", "Bahati", "Nakuru Town West", "Nakuru Town East"],
  "Narok": ["Narok North", "Narok South", "Narok East", "Narok West", "Emurua Dikirr", "Kilgoris"],
  "Kajiado": ["Kajiado North", "Kajiado Central", "Kajiado East", "Kajiado West", "Kajiado South"],
  "Kericho": ["Kipkelion East", "Kipkelion West", "Ainamoi", "Belgut", "Sigowet/Soin", "Bureti"],
  "Bomet": ["Sotik", "Chepalungu", "Bomet East", "Bomet Central", "Konoin"],
  "Kakamega": ["Lugari", "Likuyani", "Malava", "Lurambi", "Navakholo", "Mumias West", "Mumias East", "Matungu", "Butere", "Khwisero", "Shinyalu", "Ikolomani"],
  "Vihiga": ["Vihiga", "Sabatia", "Hamisi", "Luanda", "Emuhaya"],
  "Bungoma": ["Mt. Elgon", "Sirisia", "Kabuchai", "Bumula", "Kanduyi", "Webuye East", "Webuye West", "Kimilili", "Tongaren"],
  "Busia": ["Teso North", "Teso South", "Nambale", "Matayos", "Butula", "Funyula", "Budalangi"],
  "Siaya": ["Ugenya", "Ugunja", "Alego Usonga", "Gem", "Bondo", "Rarieda"],
  "Kisumu": ["Kisumu East", "Kisumu West", "Kisumu Central", "Seme", "Nyando", "Muhoroni", "Nyakach"],
  "Homa Bay": ["Kasipul", "Kabondo Kasipul", "Karachuonyo", "Rangwe", "Homa Bay Town", "Ndhiwa", "Suba North", "Suba South"],
  "Migori": ["Rongo", "Awendo", "Suna East", "Suna West", "Uriri", "Nyatike", "Kuria West", "Kuria East"],
  "Kisii": ["Bonchari", "South Mugirango", "Bomachoge Borabu", "Bobasi", "Gucha", "Bomachoge Chache", "Nyaribari Chache", "Nyaribari Masaba", "Kitutu Chache North", "Kitutu Chache South"],
  "Nyamira": ["Kitutu Masaba", "West Mugirango", "North Mugirango", "Borabu"],
};

export default function CheckoutPage() {
  const router = useRouter();
  const { items, clearCart } = useCartStore();
  const [isProcessing, setIsProcessing] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'mpesa' | 'stripe' | 'paypal'>('mpesa');

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    city: '', 
    county: 'Nairobi',
    projectName: '',
  });

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    const validSubcounties = KENYA_LOCATIONS[formData.county] || ["Other"];
    if (!validSubcounties.includes(formData.city)) {
      setFormData(prev => ({ ...prev, city: validSubcounties[0] }));
    }
  }, [formData.county]);

  const totalPrice = useMemo(() => items.reduce((sum, item) => sum + (item.price * item.quantity), 0), [items]);
  const vatAmount = useMemo(() => totalPrice * 0.16, [totalPrice]);
  const subtotal = useMemo(() => totalPrice - vatAmount, [totalPrice]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!items?.length) return toast.error("Manifest is empty");

    setIsProcessing(true);
    try {
      const orderPayload = {
        customer: { ...formData, phone: formatMpesaPhone(formData.phone) },
        items: items.map(item => ({ id: item.id, quantity: item.quantity })),
        paymentMethod,
        projectName: formData.projectName || 'General Acquisition'
      };

      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderPayload),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Checkout failed");

      if (paymentMethod === 'stripe') router.push(`/checkout/stripe?clientSecret=${data.clientSecret}`);
      else if (paymentMethod === 'paypal') router.push(`/checkout/paypal?orderId=${data.orderId}`);
      else {
        toast.success('STK Push sent!');
        router.push(`/checkout/success?orderId=${data.orderId}`);
        clearCart();
      }
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsProcessing(false);
    }
  };

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-[#FBFBFB] text-[#06392F]">
      <div className="bg-white border-b border-gray-100">
        <div className="container px-6 py-12 mx-auto">
          <Link href="/cart" className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-[#C75B39] mb-6">
            <ArrowLeft className="w-4 h-4" /> Return to Manifest
          </Link>
          <h1 className="text-4xl font-black tracking-tighter uppercase md:text-6xl">Final Settlement</h1>
        </div>
      </div>

      <div className="container px-6 py-16 mx-auto">
        <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-16 lg:grid-cols-12">
          
          <div className="space-y-12 lg:col-span-7">
            {/* Identification Section */}
            <section className="space-y-8">
              <SectionHeader number="01" title="Project Identification" />
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <InputGroup label="Representative Name" name="fullName" value={formData.fullName} onChange={handleInputChange} placeholder="e.g. Arch. John Doe" icon={<User className="w-3 h-3"/>} />
                <InputGroup label="Project Name / ID" name="projectName" value={formData.projectName} onChange={handleInputChange} placeholder="e.g. Westlands Villa" icon={<Construction className="w-3 h-3"/>} />
                <InputGroup label="Email for Invoicing" name="email" type="email" value={formData.email} onChange={handleInputChange} placeholder="john@project.com" icon={<Mail className="w-3 h-3"/>} />
                <InputGroup label="Contact Phone" name="phone" value={formData.phone} onChange={handleInputChange} placeholder="07XX XXX XXX" icon={<Phone className="w-3 h-3"/>} />
              </div>
            </section>

            {/* Logistics Section */}
            <section className="space-y-8">
              <SectionHeader number="02" title="Site Logistics" />
              <div className="space-y-6">
                <InputGroup label="Delivery Site Address" name="address" value={formData.address} onChange={handleInputChange} placeholder="e.g. LR-209, Mbagathi Way" icon={<MapPin className="w-3 h-3"/>} />

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <SelectGroup label="County" name="county" value={formData.county} onChange={handleInputChange} options={Object.keys(KENYA_LOCATIONS).sort()} />
                  <SelectGroup label="Sub-County / Area" name="city" value={formData.city} onChange={handleInputChange} options={KENYA_LOCATIONS[formData.county] || ["Other"]} />
                </div>
              </div>
            </section>

            {/* Payment Gateway */}
            <section className="space-y-8">
              <SectionHeader number="03" title="Settlement Gateway" />
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <PaymentOption active={paymentMethod === 'mpesa'} onClick={() => setPaymentMethod('mpesa')} icon={<div className="p-1 font-black text-white bg-[#4caf50] rounded px-2 text-[10px]">MPESA</div>} label="M-Pesa" description="STK Push" />
                <PaymentOption active={paymentMethod === 'stripe'} onClick={() => setPaymentMethod('stripe')} icon={<Globe className="text-blue-500" />} label="Card" description="Visa / MC" />
                <PaymentOption active={paymentMethod === 'paypal'} onClick={() => setPaymentMethod('paypal')} icon={<Landmark className="text-[#003087]" />} label="PayPal" description="Wallet" />
              </div>
            </section>
          </div>

          {/* Right Column: Order Summary & Manifest Preview */}
          <div className="lg:col-span-5">
            <div className="sticky space-y-6 top-8">
              <div className="bg-[#06392F] text-white p-8 rounded-[3rem] shadow-2xl relative overflow-hidden">
                <h2 className="flex justify-between pb-6 mb-8 text-2xl font-black uppercase border-b border-white/10">Financial Proof <ShieldCheck className="text-[#C75B39]"/></h2>
                
                <div className="mb-10 space-y-4">
                  <SummaryRow label="Material Subtotal" value={formatCurrency(subtotal)} />
                  <SummaryRow label="Statutory VAT (16%)" value={formatCurrency(vatAmount)} />
                  <SummaryRow label="Logistics" value="Gratis" highlight />
                  
                  <div className="pt-8 mt-8 border-t border-white/20">
                    <span className="text-[10px] font-black uppercase text-[#C75B39] tracking-widest">Payable Amount</span>
                    <p className="text-5xl font-black tracking-tighter">{formatCurrency(totalPrice)}</p>
                  </div>
                </div>

                <button type="submit" disabled={isProcessing} className="w-full bg-[#C75B39] text-white py-6 rounded-2xl font-black uppercase text-xs tracking-[0.4em] hover:bg-white hover:text-[#06392F] transition-all disabled:opacity-50">
                  {isProcessing ? <Loader2 className="mx-auto animate-spin" /> : "Initialize Settlement"}
                </button>
              </div>

              {/* RESTORED: Items Preview Section */}
              <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm">
                <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-6 flex justify-between items-center">
                  Items to be Dispatched <span>({items.length})</span>
                </p>
                <div className="space-y-6 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                  {items.map((item) => (
                    <div key={item.id} className="flex items-start justify-between group">
                      <div className="space-y-1">
                        <p className="font-bold text-sm text-[#06392F] uppercase tracking-tight leading-tight group-hover:text-[#C75B39] transition-colors">
                          {item.name} <span className="ml-1 text-gray-300">x{item.quantity}</span>
                        </p>
                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">
                          Unit Price: {formatCurrency(item.price)}
                        </p>
                      </div>
                      <span className="font-black text-sm text-[#06392F]">
                        {formatCurrency(item.price * item.quantity)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

// --- REFACTORED HELPERS ---

function SectionHeader({ number, title }: { number: string, title: string }) {
  return (
    <div className="flex items-center gap-4">
      <span className="flex items-center justify-center w-10 h-10 rounded-full border-2 border-[#06392F] text-xs font-black">{number}</span>
      <h2 className="text-xl font-black tracking-tight uppercase">{title}</h2>
    </div>
  );
}

function InputGroup({ label, name, value, onChange, placeholder, icon, type = "text" }: any) {
  return (
    <div className="space-y-2">
      <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-400">{icon} {label}</label>
      <input type={type} name={name} required value={value} onChange={onChange} placeholder={placeholder} className="w-full px-5 py-4 bg-white border-2 border-gray-100 rounded-2xl focus:border-[#C75B39] outline-none font-bold transition-all" />
    </div>
  );
}

function SelectGroup({ label, name, value, onChange, options }: any) {
  return (
    <div className="space-y-2">
      <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">{label}</label>
      <div className="relative">
        <select name={name} value={value} onChange={onChange} className="w-full px-5 py-4 bg-white border-2 border-gray-100 rounded-2xl focus:border-[#C75B39] outline-none font-bold appearance-none cursor-pointer">
          {options.map((opt: string) => <option key={opt} value={opt}>{opt}</option>)}
        </select>
        <ChevronDown className="absolute w-4 h-4 text-gray-400 -translate-y-1/2 pointer-events-none right-5 top-1/2" />
      </div>
    </div>
  );
}

function SummaryRow({ label, value, highlight }: any) {
  return (
    <div className="flex justify-between text-[11px] font-bold uppercase text-white/40 tracking-wider">
      <span>{label}</span>
      <span className={highlight ? "text-emerald-400" : ""}>{value}</span>
    </div>
  );
}

function PaymentOption({ active, onClick, icon, label, description }: any) {
  return (
    <button type="button" onClick={onClick} className={cn("flex flex-col items-center gap-4 p-6 border-2 rounded-[2rem] transition-all w-full text-center relative", active ? "border-[#C75B39] bg-white shadow-xl -translate-y-1" : "border-gray-100 bg-white/50 hover:border-gray-200")}>
      <div className="text-2xl">{icon}</div>
      <span className="block text-[10px] font-black uppercase tracking-widest text-[#06392F]">{label}</span>
      <span className="block text-[8px] font-bold text-gray-400 uppercase tracking-tighter">{description}</span>
      {active && <CheckCircle2 className="absolute top-3 right-3 w-4 h-4 text-[#C75B39]" />}
    </button>
  );
}