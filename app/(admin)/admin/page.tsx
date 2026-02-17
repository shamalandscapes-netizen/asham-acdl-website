'use client';

import { useEffect, useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { 
  ShoppingBag, 
  Users, 
  Package, 
  Banknote, 
  Loader2, 
  ArrowRight,
  AlertCircle,
  MousePointer2,
  Newspaper,
  TrendingUp,
  Eye,
  Download,
  Filter,
  Search,
  Calendar,
  ChevronRight,
  Plus,
  MoreVertical,
  Sparkles,
  Target,
  Clock,
  BarChart3,
  PieChart,
  Activity,
  Zap,
  DollarSign,
  TrendingDown,
  AlertTriangle,
  Layers,
  FileText,
  CreditCard,
  Box,
  ShoppingCart,
  CheckCircle,
  XCircle,
  ArrowUpRight,
  ArrowDownRight,
  Settings,
  RefreshCw,
  Star
} from 'lucide-react';
import { createClient } from '@/supabase/client';
import Link from 'next/link';
import toast from 'react-hot-toast';
import type { Database } from '@/types/supabase';

type Product = Database['public']['Tables']['products']['Row'];
type Order = Database['public']['Tables']['orders']['Row'];
type Profile = Database['public']['Tables']['profiles']['Row'];
type PaymentTransaction = Database['public']['Tables']['payment_transactions']['Row'];
type Post = Database['public']['Tables']['posts']['Row'];

interface DashboardStats {
  totalRevenue: number;
  activeOrders: number;
  totalProducts: number;
  totalCustomers: number;
  lowStockProducts: number;
  totalLeads: number;
  totalPosts: number;
  conversionRate: number;
  avgOrderValue: number;
  pendingPayments: number;
  digitalProducts: number;
  averageRating: number;
  totalRefunds: number;
  monthlyGrowth: number;
  profitMargin: number;
  topSellingCategory: string;
}

export default function AdminOverview() {
  const router = useRouter();
  const supabase = createClient();
  
  const [stats, setStats] = useState<DashboardStats>({
    totalRevenue: 0,
    activeOrders: 0,
    totalProducts: 0,
    totalCustomers: 0,
    lowStockProducts: 0,
    totalLeads: 0,
    totalPosts: 0,
    conversionRate: 0,
    avgOrderValue: 0,
    pendingPayments: 0,
    digitalProducts: 0,
    averageRating: 0,
    totalRefunds: 0,
    monthlyGrowth: 0,
    profitMargin: 0,
    topSellingCategory: 'Unknown'
  });
  
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const [recentTransactions, setRecentTransactions] = useState<PaymentTransaction[]>([]);
  const [topProducts, setTopProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [timeRange, setTimeRange] = useState<'today' | 'week' | 'month' | 'quarter'>('week');
  const [refreshing, setRefreshing] = useState(false);

  const fetchDashboardData = async () => {
    try {
      setRefreshing(true);
      setError(null);
      
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/login');
        return;
      }

      // Fetch all data in parallel
      const [
        ordersRes,
        productsRes,
        customersRes,
        leadsRes,
        postsRes,
        transactionsRes,
        lowStockRes
      ] = await Promise.all([
        supabase
          .from('orders')
          .select('*, order_items(*, products(*))')
          .order('created_at', { ascending: false })
          .limit(50),
        supabase
          .from('products')
          .select('*')
          .order('total_sold', { ascending: false })
          .limit(10),
        supabase
          .from('profiles')
          .select('*', { count: 'exact', head: true }),
        supabase
          .from('lead_events')
          .select('*', { count: 'exact', head: true }),
        supabase
          .from('posts')
          .select('*', { count: 'exact', head: true }),
        supabase
          .from('payment_transactions')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(10),
        supabase
          .from('products')
          .select('*')
          .lt('stock_quantity', 10)
          .gt('stock_quantity', 0)
      ]);

      // Calculate comprehensive stats
      const orders = ordersRes.data || [];
      const products = productsRes.data || [];
      const transactions = transactionsRes.data || [];
      
      const completedOrders = orders.filter(o => o.status === 'completed');
      const activeOrders = orders.filter(o => !['completed', 'cancelled'].includes(o.status));
      const pendingPayments = orders.filter(o => o.payment_status !== 'paid').length;
      
      const totalRevenue = completedOrders.reduce((sum, order) => sum + (order.total_amount || 0), 0);
      const totalOrdersValue = orders.reduce((sum, order) => sum + (order.total_amount || 0), 0);
      const avgOrderValue = completedOrders.length > 0 
        ? totalRevenue / completedOrders.length 
        : 0;
      
      const digitalProducts = products.filter(p => p.is_digital).length;
      const lowStockProducts = lowStockRes.data?.length || 0;
      
      // Calculate average product rating
      const ratedProducts = products.filter(p => p.average_rating);
      const averageRating = ratedProducts.length > 0
        ? ratedProducts.reduce((sum, p) => sum + (p.average_rating || 0), 0) / ratedProducts.length
        : 0;

      // Calculate profit margin (simplified)
      const costProducts = products.filter(p => p.cost_price);
      const profitMargin = costProducts.length > 0
        ? costProducts.reduce((sum, p) => {
            const profit = (p.price || 0) - (p.cost_price || 0);
            const margin = (profit / (p.price || 1)) * 100;
            return sum + margin;
          }, 0) / costProducts.length
        : 0;

      // Find top-selling category
      const categorySales: Record<string, number> = {};
      completedOrders.forEach(order => {
        if (order.order_items) {
          order.order_items.forEach((item: { products: { category: string | number; }; total_price: any; }) => {
            if (item.products?.category) {
              categorySales[item.products.category] = (categorySales[item.products.category] || 0) + (item.total_price || 0);
            }
          });
        }
      });
      
      const topCategory = Object.entries(categorySales).sort((a, b) => b[1] - a[1])[0]?.[0] || 'Unknown';

      // Calculate monthly growth (simplified)
      const thisMonthRevenue = completedOrders
        .filter(o => {
          const date = new Date(o.created_at || '');
          const now = new Date();
          return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
        })
        .reduce((sum, o) => sum + (o.total_amount || 0), 0);
      
      const lastMonthRevenue = completedOrders
        .filter(o => {
          const date = new Date(o.created_at || '');
          const now = new Date();
          const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1);
          return date.getMonth() === lastMonth.getMonth() && date.getFullYear() === lastMonth.getFullYear();
        })
        .reduce((sum, o) => sum + (o.total_amount || 0), 0);
      
      const monthlyGrowth = lastMonthRevenue > 0 
        ? ((thisMonthRevenue - lastMonthRevenue) / lastMonthRevenue) * 100 
        : 100;

      setStats({
        totalRevenue,
        activeOrders: activeOrders.length,
        totalProducts: products.length,
        totalCustomers: customersRes.count || 0,
        lowStockProducts,
        totalLeads: leadsRes.count || 0,
        totalPosts: postsRes.count || 0,
        conversionRate: stats.totalLeads > 0 
          ? (completedOrders.length / stats.totalLeads) * 100 
          : 0,
        avgOrderValue,
        pendingPayments,
        digitalProducts,
        averageRating,
        totalRefunds: orders.filter(o => o.status === 'refunded').length,
        monthlyGrowth,
        profitMargin,
        topSellingCategory: topCategory
      });

      setRecentOrders(orders.slice(0, 5));
      setRecentTransactions(transactions);
      setTopProducts(products.slice(0, 4));

    } catch (err: any) {
      console.error('Dashboard Error:', err);
      setError(err.message || 'Failed to load dashboard data');
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'completed':
      case 'paid':
      case 'success':
        return 'bg-gradient-to-r from-emerald-500 to-emerald-600';
      case 'processing':
      case 'pending':
        return 'bg-gradient-to-r from-amber-500 to-amber-600';
      case 'cancelled':
      case 'failed':
      case 'refunded':
        return 'bg-gradient-to-r from-rose-500 to-rose-600';
      default:
        return 'bg-gradient-to-r from-slate-500 to-slate-600';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'completed':
      case 'paid':
      case 'success':
        return <CheckCircle className="w-4 h-4" />;
      case 'processing':
      case 'pending':
        return <Clock className="w-4 h-4" />;
      case 'cancelled':
      case 'failed':
      case 'refunded':
        return <XCircle className="w-4 h-4" />;
      default:
        return <AlertCircle className="w-4 h-4" />;
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const StatCard = ({ 
    title, 
    value, 
    icon: Icon, 
    trend, 
    description,
    color = 'emerald'
  }: { 
    title: string; 
    value: string | number; 
    icon: any;
    trend?: number;
    description?: string;
    color?: 'emerald' | 'blue' | 'purple' | 'amber' | 'rose';
  }) => {
    const colorClasses = {
      emerald: 'from-emerald-500 to-teal-600',
      blue: 'from-blue-500 to-cyan-600',
      purple: 'from-purple-500 to-violet-600',
      amber: 'from-amber-500 to-orange-600',
      rose: 'from-rose-500 to-pink-600'
    };

    return (
      <div className="relative p-6 transition-all duration-300 bg-white border shadow-sm group rounded-2xl border-slate-200 hover:shadow-lg hover:-translate-y-1">
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <p className="text-sm font-medium text-slate-600">{title}</p>
            <p className="text-2xl font-bold text-slate-900">{value}</p>
            {description && (
              <p className="text-xs text-slate-500">{description}</p>
            )}
          </div>
          <div className={`p-3 rounded-xl bg-gradient-to-br ${colorClasses[color]} shadow-md`}>
            <Icon className="w-5 h-5 text-white" />
          </div>
        </div>
        {trend !== undefined && (
          <div className={`flex items-center gap-1 mt-4 text-sm ${trend >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
            {trend >= 0 ? (
              <ArrowUpRight className="w-4 h-4" />
            ) : (
              <ArrowDownRight className="w-4 h-4" />
            )}
            <span className="font-semibold">{Math.abs(trend)}%</span>
            <span className="text-slate-500">from last month</span>
          </div>
        )}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-50 via-white to-emerald-50/30">
        <div className="space-y-6 text-center">
          <div className="relative">
            <div className="w-20 h-20 border-4 rounded-full border-slate-200 border-t-emerald-500 animate-spin"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <Activity className="w-8 h-8 text-emerald-500 animate-pulse" />
            </div>
          </div>
          <div className="space-y-2">
            <p className="text-lg font-bold font-montserrat text-slate-700">Loading Dashboard</p>
            <p className="text-sm font-montserrat text-slate-500 animate-pulse">Crunching the latest numbers...</p>
          </div>
          <div className="w-64 h-2 mx-auto overflow-hidden rounded-full bg-slate-200">
            <div className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 animate-shimmer"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-emerald-50/30 font-montserrat">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute rounded-full top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-emerald-200/20 to-teal-200/10 blur-3xl"></div>
        <div className="absolute rounded-full bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-r from-blue-200/10 to-purple-200/10 blur-3xl"></div>
      </div>

      <div className="relative max-w-[1920px] mx-auto space-y-6 p-4 md:p-6">
        {/* Header */}
        <div className="flex flex-col items-start justify-between gap-4 lg:flex-row lg:items-center">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold text-slate-900">Dashboard Overview</h1>
            <p className="text-slate-600">Welcome back! Here's your business at a glance</p>
          </div>
          
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative">
              <Search className="absolute w-4 h-4 transform -translate-y-1/2 left-3 top-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search..."
                className="pl-10 pr-4 py-2.5 bg-white border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 w-48"
              />
            </div>
            
            <div className="flex items-center gap-2 p-1 bg-white border border-slate-300 rounded-xl">
              {(['today', 'week', 'month', 'quarter'] as const).map((range) => (
                <button
                  key={range}
                  onClick={() => setTimeRange(range)}
                  className={`px-3 py-1.5 text-sm font-medium rounded-lg capitalize transition-all ${
                    timeRange === range
                      ? 'bg-emerald-500 text-white shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {range}
                </button>
              ))}
            </div>
            
            <button
              onClick={fetchDashboardData}
              disabled={refreshing}
              className="p-2.5 bg-white border border-slate-300 rounded-xl text-slate-600 hover:bg-slate-50 transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
            </button>
            
            <Link
              href="/admin/products/new"
              className="px-4 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-medium rounded-xl hover:shadow-lg hover:shadow-emerald-500/25 transition-all flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              New Product
            </Link>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Total Revenue"
            value={formatCurrency(stats.totalRevenue)}
            icon={DollarSign}
            trend={stats.monthlyGrowth}
            description="This month"
            color="emerald"
          />
          
          <StatCard
            title="Active Orders"
            value={stats.activeOrders}
            icon={ShoppingBag}
            description="Awaiting fulfillment"
            color="blue"
          />
          
          <StatCard
            title="Conversion Rate"
            value={`${stats.conversionRate.toFixed(1)}%`}
            icon={Target}
            description="Lead to order"
            color="purple"
          />
          
          <StatCard
            title="Avg Order Value"
            value={formatCurrency(stats.avgOrderValue)}
            icon={TrendingUp}
            description="Per completed order"
            color="amber"
          />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Total Products"
            value={stats.totalProducts}
            icon={Package}
            description={`${stats.digitalProducts} digital`}
            color="blue"
          />
          
          <StatCard
            title="Total Customers"
            value={stats.totalCustomers}
            icon={Users}
            description="Registered users"
            color="purple"
          />
          
          <StatCard
            title="Low Stock Alert"
            value={stats.lowStockProducts}
            icon={AlertTriangle}
            description="Need attention"
            color="rose"
          />
          
          <StatCard
            title="Blog Posts"
            value={stats.totalPosts}
            icon={Newspaper}
            description="Published content"
            color="amber"
          />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Recent Orders */}
          <div className="p-6 bg-white border shadow-sm lg:col-span-2 rounded-2xl border-slate-200">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-lg font-bold text-slate-900">Recent Orders</h2>
                <p className="text-sm text-slate-500">Latest customer activities</p>
              </div>
              <Link
                href="/admin/orders"
                className="flex items-center gap-2 text-sm font-medium text-emerald-600 hover:text-emerald-700"
              >
                View All
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            
            <div className="space-y-4">
              {recentOrders.map((order) => (
                <div
                  key={order.id}
                  onClick={() => router.push(`/admin/orders/${order.id}`)}
                  className="flex items-center justify-between p-4 transition-colors cursor-pointer bg-slate-50/50 hover:bg-slate-100 rounded-xl group"
                >
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${getStatusColor(order.status || '')} text-white`}>
                      {getStatusIcon(order.status || '')}
                    </div>
                    <div>
                      <p className="font-medium text-slate-900">
                        {order.order_number || `#${order.id.slice(0, 8)}`}
                      </p>
                      <p className="text-sm text-slate-500">
                        {new Date(order.created_at || '').toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <p className="font-bold text-slate-900">
                      {formatCurrency(order.total_amount || 0)}
                    </p>
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status || '')} text-white`}>
                        {order.status}
                      </span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        order.payment_status === 'paid' 
                          ? 'bg-emerald-100 text-emerald-700'
                          : 'bg-amber-100 text-amber-700'
                      }`}>
                        {order.payment_status}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
              
              {recentOrders.length === 0 && (
                <div className="py-12 text-center">
                  <ShoppingBag className="w-12 h-12 mx-auto mb-4 text-slate-300" />
                  <p className="text-slate-500">No recent orders</p>
                </div>
              )}
            </div>
          </div>

          {/* Quick Stats */}
          <div className="space-y-6">
            <div className="p-6 text-white bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl">
              <h3 className="mb-6 text-lg font-bold">Business Insights</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-white/10">
                      <TrendingUp className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-sm text-slate-300">Monthly Growth</p>
                      <p className={`text-xl font-bold ${stats.monthlyGrowth >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                        {stats.monthlyGrowth >= 0 ? '+' : ''}{stats.monthlyGrowth.toFixed(1)}%
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-white/10">
                      <BarChart3 className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-sm text-slate-300">Profit Margin</p>
                      <p className="text-xl font-bold text-emerald-400">
                        {stats.profitMargin.toFixed(1)}%
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-white/10">
                      <Layers className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-sm text-slate-300">Top Category</p>
                      <p className="text-lg font-bold">{stats.topSellingCategory}</p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-white/10">
                      <Star className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-sm text-slate-300">Avg. Product Rating</p>
                      <p className="text-xl font-bold text-amber-400">
                        {stats.averageRating.toFixed(1)}/5
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="p-6 bg-white border shadow-sm rounded-2xl border-slate-200">
              <h3 className="mb-4 text-lg font-bold text-slate-900">Quick Actions</h3>
              <div className="space-y-3">
                <Link
                  href="/admin/analytics"
                  className="flex items-center justify-between p-3 transition-colors bg-slate-50 hover:bg-slate-100 rounded-xl group"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-emerald-100">
                      <BarChart3 className="w-4 h-4 text-emerald-600" />
                    </div>
                    <span className="font-medium text-slate-900">View Analytics</span>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-600" />
                </Link>

                <Link
                  href="/admin/posts/new"
                  className="flex items-center justify-between p-3 transition-colors bg-slate-50 hover:bg-slate-100 rounded-xl group"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <Newspaper className="w-4 h-4 text-blue-600" />
                    </div>
                    <span className="font-medium text-slate-900">Create Post</span>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600" />
                </Link>

                <Link
                  href="/admin/products"
                  className="flex items-center justify-between p-3 transition-colors bg-slate-50 hover:bg-slate-100 rounded-xl group"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-purple-100 rounded-lg">
                      <Package className="w-4 h-4 text-purple-600" />
                    </div>
                    <span className="font-medium text-slate-900">Manage Inventory</span>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-purple-600" />
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Recent Transactions */}
          <div className="p-6 bg-white border shadow-sm rounded-2xl border-slate-200">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-lg font-bold text-slate-900">Recent Payments</h2>
                <p className="text-sm text-slate-500">Latest financial transactions</p>
              </div>
            </div>
            
            <div className="space-y-3">
              {recentTransactions.slice(0, 5).map((transaction) => (
                <div
                  key={transaction.id}
                  className="flex items-center justify-between p-3 rounded-lg bg-slate-50/50"
                >
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${
                      transaction.status === 'success' 
                        ? 'bg-emerald-100 text-emerald-600'
                        : 'bg-amber-100 text-amber-600'
                    }`}>
                      <CreditCard className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="font-medium text-slate-900">
                        {transaction.provider_transaction_id || transaction.mpesa_receipt_number || 'N/A'}
                      </p>
                      <p className="text-sm text-slate-500">
                        {new Date(transaction.created_at || '').toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <p className="font-bold text-slate-900">
                      {formatCurrency(transaction.amount)}
                    </p>
                    <p className={`text-sm font-medium ${
                      transaction.status === 'success' 
                        ? 'text-emerald-600'
                        : transaction.status === 'pending'
                        ? 'text-amber-600'
                        : 'text-rose-600'
                    }`}>
                      {transaction.status}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Top Products */}
          <div className="p-6 bg-white border shadow-sm rounded-2xl border-slate-200">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-lg font-bold text-slate-900">Top Products</h2>
                <p className="text-sm text-slate-500">Best selling items</p>
              </div>
            </div>
            
            <div className="space-y-3">
              {topProducts.map((product) => (
                <div
                  key={product.id}
                  onClick={() => router.push(`/admin/products/${product.id}`)}
                  className="flex items-center justify-between p-3 transition-colors rounded-lg cursor-pointer bg-slate-50/50 hover:bg-slate-100"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-slate-200">
                      {product.image_url ? (
                        <div className="w-full h-full rounded-lg bg-slate-300" />
                      ) : (
                        <Package className="w-5 h-5 text-slate-400" />
                      )}
                    </div>
                    <div className="max-w-[200px]">
                      <p className="font-medium truncate text-slate-900">{product.name}</p>
                      <p className="text-sm text-slate-500">{product.category}</p>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <p className="font-bold text-slate-900">
                      {formatCurrency(product.price || 0)}
                    </p>
                    <p className="text-sm text-slate-500">
                      Sold: {product.total_sold || 0}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* System Status */}
        <div className="p-6 text-white bg-gradient-to-r from-slate-900 to-slate-800 rounded-2xl">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-bold">System Status</h3>
              <p className="text-sm text-slate-300">All systems operational</p>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
              <span className="text-sm">Live</span>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            <div className="p-4 text-center bg-white/5 rounded-xl">
              <div className="mb-1 text-2xl font-bold">{stats.activeOrders}</div>
              <div className="text-sm text-slate-300">Orders in Queue</div>
            </div>
            <div className="p-4 text-center bg-white/5 rounded-xl">
              <div className="mb-1 text-2xl font-bold">{stats.pendingPayments}</div>
              <div className="text-sm text-slate-300">Pending Payments</div>
            </div>
            <div className="p-4 text-center bg-white/5 rounded-xl">
              <div className="mb-1 text-2xl font-bold">{stats.lowStockProducts}</div>
              <div className="text-sm text-slate-300">Low Stock Items</div>
            </div>
            <div className="p-4 text-center bg-white/5 rounded-xl">
              <div className="mb-1 text-2xl font-bold">{stats.digitalProducts}</div>
              <div className="text-sm text-slate-300">Digital Products</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}