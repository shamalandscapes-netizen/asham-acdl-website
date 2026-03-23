'use client';

import { useEffect, useState, useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { createClient } from '@/supabase/client';
import { 
  ArrowLeft, RefreshCw, Mail, Phone, Calendar, Clock,
  Receipt, Package, CreditCard, ShoppingBag, TrendingUp,
  Loader2, ShieldAlert, User, DollarSign, CheckCircle,
  XCircle, AlertCircle
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { format } from 'date-fns';

// Types based on your database schema
type Profile = {
  id: string;
  email: string | null;
  full_name: string | null;
  role: 'super_admin' | 'admin' | 'accounts' | 'employee' | 'customer';
  is_active: boolean | null;
  created_at: string;
};

type Order = {
  id: string;
  user_id: string | null;
  order_number: string | null;
  product_id: string | null;
  amount: number | null;
  total_amount: number | null;
  status: string | null;
  payment_status: string | null;
  created_at: string | null;
};

type PaymentTransaction = {
  id: string;
  user_id: string | null;
  order_id: string | null;
  amount: number;
  status: string;
  mpesa_receipt_number: string | null;
  created_at: string | null;
};

export default function PersonnelDossier() {
  const params = useParams();
  const id = params?.id as string;
  const router = useRouter();
  const supabase = createClient();
  
  const [profile, setProfile] = useState<Profile | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [payments, setPayments] = useState<PaymentTransaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadData = async () => {
    if (!id) {
      toast.error('No user ID provided');
      return;
    }

    console.log('🔄 Loading dossier for user:', id);
    setRefreshing(true);

    try {
      // 1. Load profile
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', id)
        .maybeSingle();

      console.log('👤 Profile loaded:', { data: profileData, error: profileError });

      if (profileError) {
        console.error('Profile error:', profileError);
        throw new Error(`Failed to load profile: ${profileError.message}`);
      }

      if (!profileData) {
        console.warn('No profile found for ID:', id);
        toast.error('User not found');
        setProfile(null);
      } else {
        setProfile(profileData);
      }

      // 2. Load orders for this user
      const { data: ordersData, error: ordersError } = await supabase
        .from('orders')
        .select('*')
        .eq('user_id', id)
        .order('created_at', { ascending: false })
        .limit(100);

      console.log('📦 Orders loaded:', { count: ordersData?.length || 0, error: ordersError });

      if (ordersError) {
        console.warn('Orders error:', ordersError);
        // Continue without orders
      }

      setOrders(ordersData || []);

      // 3. Load payment transactions for this user
      const { data: paymentsData, error: paymentsError } = await supabase
        .from('payment_transactions')
        .select('*')
        .eq('user_id', id)
        .order('created_at', { ascending: false })
        .limit(100);

      console.log('💰 Payments loaded:', { count: paymentsData?.length || 0, error: paymentsError });

      if (paymentsError) {
        console.warn('Payments error:', paymentsError);
        // Continue without payments
      }

      setPayments(paymentsData || []);

      // Success message
      if (profileData) {
        toast.success(`Loaded ${ordersData?.length || 0} orders for ${profileData.full_name}`);
      }

    } catch (error: any) {
      console.error('💥 Load error:', error);
      toast.error(`Failed to load: ${error.message}`);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    if (!id) {
      console.log('❌ No user ID in URL');
      router.push('/admin/users');
      return;
    }

    loadData();

    // Real-time subscriptions
    const ordersChannel = supabase
      .channel(`orders-${id}`)
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'orders', filter: `user_id=eq.${id}` },
        () => {
          console.log('📦 Order update detected');
          loadData();
        }
      )
      .subscribe();

    const paymentsChannel = supabase
      .channel(`payments-${id}`)
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'payment_transactions', filter: `user_id=eq.${id}` },
        () => {
          console.log('💰 Payment update detected');
          loadData();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(ordersChannel);
      supabase.removeChannel(paymentsChannel);
    };
  }, [id]);

  // Calculate metrics
  const metrics = useMemo(() => {
    const completedOrders = orders.filter(o => o.status === 'completed' || o.payment_status === 'paid');
    const pendingOrders = orders.filter(o => o.status === 'pending' || o.payment_status === 'pending');
    const totalRevenue = orders.reduce((sum, order) => sum + (order.total_amount || order.amount || 0), 0);
    const totalPayments = payments.reduce((sum, payment) => sum + (payment.amount || 0), 0);
    
    return {
      totalOrders: orders.length,
      completedOrders: completedOrders.length,
      pendingOrders: pendingOrders.length,
      totalRevenue,
      totalPayments,
      averageOrderValue: orders.length > 0 ? totalRevenue / orders.length : 0,
      paymentSuccessRate: payments.length > 0 
        ? (payments.filter(p => p.status === 'success').length / payments.length) * 100 
        : 0
    };
  }, [orders, payments]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="relative">
            <Loader2 className="w-12 h-12 mx-auto animate-spin text-[#C75B39]" />
            <User className="absolute top-1/2 left-1/2 w-6 h-6 -translate-x-1/2 -translate-y-1/2 text-white" />
          </div>
          <p className="mt-4 text-lg font-semibold text-slate-900">Loading Personnel Dossier</p>
          <p className="mt-2 text-sm text-slate-500">User ID: {id}</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 p-8">
        <div className="max-w-md w-full">
          <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center">
            <ShieldAlert className="w-16 h-16 mx-auto text-rose-500 mb-4" />
            <h2 className="text-2xl font-bold text-slate-900">User Not Found</h2>
            <p className="mt-2 text-slate-600">No user found with ID: <code className="text-sm bg-slate-100 px-2 py-1 rounded">{id}</code></p>
            
            <div className="mt-8 p-4 bg-slate-50 rounded-lg">
              <h3 className="font-semibold text-slate-700 mb-2">Next Steps:</h3>
              <ul className="text-sm text-slate-600 space-y-1">
                <li>• Make sure the user exists in the database</li>
                <li>• Check if you have permission to view this user</li>
                <li>• Verify the user ID is correct</li>
              </ul>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 justify-center mt-8">
              <button
                onClick={() => router.push('/admin/users')}
                className="px-6 py-3 font-medium text-white rounded-xl bg-[#C75B39] hover:bg-[#b35233]"
              >
                Return to Users
              </button>
              <button
                onClick={loadData}
                className="px-6 py-3 font-medium rounded-xl text-slate-600 hover:bg-slate-100"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const getInitials = (name: string | null) => {
    if (!name) return '?';
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const getStatusColor = (status: string | null) => {
    if (!status) return 'bg-slate-100 text-slate-700';
    
    switch (status.toLowerCase()) {
      case 'completed':
      case 'paid':
      case 'success':
        return 'bg-emerald-100 text-emerald-700';
      case 'pending':
      case 'processing':
        return 'bg-amber-100 text-amber-700';
      case 'cancelled':
      case 'failed':
      case 'declined':
        return 'bg-rose-100 text-rose-700';
      default:
        return 'bg-slate-100 text-slate-700';
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'N/A';
    try {
      return format(new Date(dateString), 'MMM d, yyyy');
    } catch {
      return 'Invalid date';
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto p-4 md:p-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <button
              onClick={() => router.push('/admin/users')}
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg text-slate-600 hover:bg-white hover:shadow-sm w-fit"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Users
            </button>
            
            <div className="flex items-center gap-3">
              <div className="px-3 py-1.5 bg-white rounded-lg shadow-sm">
                <span className="text-sm font-medium text-slate-700">
                  {metrics.totalOrders} orders • KES {metrics.totalRevenue.toLocaleString()}
                </span>
              </div>
              <button
                onClick={loadData}
                disabled={refreshing}
                className="p-2 rounded-lg hover:bg-white"
                title="Refresh data"
              >
                <RefreshCw className={`w-5 h-5 ${refreshing ? 'animate-spin' : ''}`} />
              </button>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-6">
            <div className="flex flex-col md:flex-row md:items-center gap-6">
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-slate-900 to-[#06392F] flex items-center justify-center text-2xl font-bold text-white">
                  {getInitials(profile.full_name)}
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-slate-900">{profile.full_name || 'Unknown User'}</h1>
                  <div className="flex items-center gap-3 mt-2">
                    <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
                      profile.role === 'super_admin' ? 'bg-purple-100 text-purple-700' :
                      profile.role === 'admin' ? 'bg-blue-100 text-blue-700' :
                      profile.role === 'accounts' ? 'bg-emerald-100 text-emerald-700' :
                      'bg-slate-100 text-slate-700'
                    }`}>
                      {profile.role?.replace('_', ' ') || 'No role'}
                    </span>
                    <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
                      profile.is_active 
                        ? 'bg-emerald-100 text-emerald-700' 
                        : 'bg-rose-100 text-rose-700'
                    }`}>
                      {profile.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="md:ml-auto">
                <div className="flex flex-wrap gap-4">
                  {profile.email && (
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-slate-400" />
                      <span className="text-sm">{profile.email}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-slate-400" />
                    <span className="text-sm">
                      Joined {formatDate(profile.created_at)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-white p-6 rounded-2xl border border-slate-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">Total Orders</p>
                <p className="text-2xl font-bold text-slate-900 mt-1">{metrics.totalOrders}</p>
              </div>
              <ShoppingBag className="w-8 h-8 text-[#C75B39]" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">Completed Orders</p>
                <p className="text-2xl font-bold text-slate-900 mt-1">{metrics.completedOrders}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-emerald-500" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">Total Revenue</p>
                <p className="text-2xl font-bold text-slate-900 mt-1">KES {metrics.totalRevenue.toLocaleString()}</p>
              </div>
              <DollarSign className="w-8 h-8 text-emerald-500" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">Payment Success</p>
                <p className="text-2xl font-bold text-slate-900 mt-1">{metrics.paymentSuccessRate.toFixed(1)}%</p>
              </div>
              <TrendingUp className="w-8 h-8 text-blue-500" />
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Orders Section */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl border border-slate-200">
              <div className="p-6 border-b border-slate-100">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-lg font-semibold text-slate-900">Order History</h2>
                    <p className="text-sm text-slate-500 mt-1">
                      {orders.length} order{orders.length !== 1 ? 's' : ''} • {metrics.pendingOrders} pending
                    </p>
                  </div>
                  {orders.length > 0 && (
                    <span className="text-sm font-medium text-[#C75B39]">
                      KES {metrics.totalRevenue.toLocaleString()} total
                    </span>
                  )}
                </div>
              </div>

              <div className="p-6">
                {orders.length === 0 ? (
                  <div className="text-center py-12">
                    <Package className="w-16 h-16 mx-auto text-slate-300" />
                    <p className="mt-4 text-slate-600">No orders found</p>
                    <p className="text-sm text-slate-500 mt-2">This user hasn't placed any orders yet</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {orders.map((order) => (
                      <div key={order.id} className="flex items-center justify-between p-4 border border-slate-100 rounded-xl hover:bg-slate-50">
                        <div className="flex items-center gap-4">
                          <div className="p-2 bg-slate-100 rounded-lg">
                            <Receipt className="w-5 h-5 text-slate-600" />
                          </div>
                          <div>
                            <p className="font-medium text-slate-900">
                              Order #{order.order_number || order.id.slice(0, 8)}
                            </p>
                            <div className="flex items-center gap-3 mt-1">
                              <span className="text-sm text-slate-500">
                                {formatDate(order.created_at)}
                              </span>
                              <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(order.payment_status || order.status)}`}>
                                {order.payment_status || order.status || 'Unknown'}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-slate-900">
                            KES {(order.total_amount || order.amount || 0).toLocaleString()}
                          </p>
                          {order.payment_status && (
                            <p className="text-xs text-slate-500 mt-1">
                              {order.payment_status === 'paid' ? 'Paid' : 'Payment pending'}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Payments Section */}
            {payments.length > 0 && (
              <div className="mt-6 bg-white rounded-2xl border border-slate-200">
                <div className="p-6 border-b border-slate-100">
                  <h2 className="text-lg font-semibold text-slate-900">Payment History</h2>
                  <p className="text-sm text-slate-500 mt-1">
                    {payments.length} payment{payments.length !== 1 ? 's' : ''} • KES {metrics.totalPayments.toLocaleString()} total
                  </p>
                </div>

                <div className="p-6">
                  <div className="space-y-4">
                    {payments.map((payment) => (
                      <div key={payment.id} className="flex items-center justify-between p-4 border border-slate-100 rounded-xl hover:bg-slate-50">
                        <div className="flex items-center gap-4">
                          <div className={`p-2 rounded-lg ${
                            payment.status === 'success' ? 'bg-emerald-100' : 
                            payment.status === 'pending' ? 'bg-amber-100' : 
                            'bg-rose-100'
                          }`}>
                            <CreditCard className={`w-5 h-5 ${
                              payment.status === 'success' ? 'text-emerald-600' : 
                              payment.status === 'pending' ? 'text-amber-600' : 
                              'text-rose-600'
                            }`} />
                          </div>
                          <div>
                            <p className="font-medium text-slate-900">
                              {payment.mpesa_receipt_number ? `MPESA: ${payment.mpesa_receipt_number}` : 'Payment'}
                            </p>
                            <div className="flex items-center gap-3 mt-1">
                              <span className="text-sm text-slate-500">
                                {formatDate(payment.created_at)}
                              </span>
                              <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(payment.status)}`}>
                                {payment.status}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-slate-900">
                            KES {payment.amount.toLocaleString()}
                          </p>
                          <p className="text-xs text-slate-500 mt-1">
                            {payment.order_id ? `Order: ${payment.order_id.slice(0, 8)}` : 'No order linked'}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar Stats */}
          <div className="space-y-6">
            {/* User Details */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6">
              <h3 className="font-semibold text-slate-900 mb-4">User Details</h3>
              <div className="space-y-4">
                <div>
                  <p className="text-xs text-slate-500">User ID</p>
                  <p className="text-sm font-mono bg-slate-50 p-2 rounded mt-1 overflow-x-auto">
                    {profile.id}
                  </p>
                </div>
                
                <div>
                  <p className="text-xs text-slate-500">Role</p>
                  <p className="text-sm font-medium mt-1">{profile.role?.replace('_', ' ')}</p>
                </div>
                
                <div>
                  <p className="text-xs text-slate-500">Account Status</p>
                  <div className="flex items-center gap-2 mt-1">
                    <div className={`w-2 h-2 rounded-full ${profile.is_active ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                    <span className="text-sm font-medium">
                      {profile.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                </div>
                
                <div>
                  <p className="text-xs text-slate-500">Member Since</p>
                  <p className="text-sm font-medium mt-1">{formatDate(profile.created_at)}</p>
                </div>
              </div>
            </div>

            {/* Performance Summary */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6">
              <h3 className="font-semibold text-slate-900 mb-4">Performance Summary</h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm text-slate-600">Order Completion</span>
                    <span className="text-sm font-medium">{metrics.completedOrders}/{metrics.totalOrders}</span>
                  </div>
                  <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-emerald-500 rounded-full"
                      style={{ width: `${metrics.totalOrders > 0 ? (metrics.completedOrders / metrics.totalOrders) * 100 : 0}%` }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm text-slate-600">Avg. Order Value</span>
                    <span className="text-sm font-medium">KES {metrics.averageOrderValue.toLocaleString()}</span>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm text-slate-600">Payment Success Rate</span>
                    <span className="text-sm font-medium">{metrics.paymentSuccessRate.toFixed(1)}%</span>
                  </div>
                  <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-blue-500 rounded-full"
                      style={{ width: `${metrics.paymentSuccessRate}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6">
              <h3 className="font-semibold text-slate-900 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <button
                  onClick={loadData}
                  disabled={refreshing}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200"
                >
                  <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
                  Refresh Data
                </button>
                
                <button
                  onClick={() => router.push(`/admin/users/${profile.id}/edit`)}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium rounded-lg bg-[#C75B39] text-white hover:bg-[#b35233]"
                >
                  Edit User Profile
                </button>
                
                <button
                  onClick={() => router.push(`/admin/orders?user=${profile.id}`)}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50"
                >
                  View All Orders
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}