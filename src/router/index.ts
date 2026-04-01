import { createRouter, createWebHistory } from 'vue-router';
import AppShell from '../components/layout/AppShell.vue';
import LoginPage from '../modules/auth/pages/LoginPage.vue';
import RegisterPage from '../modules/auth/pages/RegisterPage.vue';
import VerifyEmailPage from '../modules/auth/pages/VerifyEmailPage.vue';
import VerifyEmailSentPage from '../modules/auth/pages/VerifyEmailSentPage.vue';
import DashboardPage from '../modules/dashboard/pages/DashboardPage.vue';
import CustomersPage from '../modules/customers/pages/CustomersPage.vue';
import ProductsPage from '../modules/products/pages/ProductsPage.vue';
import OrdersPage from '../modules/orders/pages/OrdersPage.vue';
import OrderDetailsPage from '../modules/orders/pages/OrderDetailsPage.vue';
import ConversationsPage from '../modules/inbox/pages/ConversationsPage.vue';
import IntegrationsPage from '../modules/integrations/pages/IntegrationsPage.vue';
import { getToken } from '../utils/token';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/login', component: LoginPage, meta: { guestOnly: true } },
    { path: '/register', component: RegisterPage, meta: { guestOnly: true } },
    { path: '/verify-email', component: VerifyEmailPage },
    { path: '/verify-email-sent', component: VerifyEmailSentPage, meta: { guestOnly: true } },
    {
      path: '/',
      component: AppShell,
      meta: { requiresAuth: true },
      children: [
        { path: '', component: DashboardPage },
        { path: 'customers', component: CustomersPage },
        { path: 'products', component: ProductsPage },
        { path: 'orders', component: OrdersPage },
        { path: 'orders/:id', component: OrderDetailsPage },
        { path: 'inbox', component: ConversationsPage },
        { path: 'integrations', component: IntegrationsPage },
      ],
    },
  ],
});

router.beforeEach((to) => {
  const isAuthenticated = Boolean(getToken());

  if (to.meta.requiresAuth && !isAuthenticated) {
    return '/login';
  }

  if (to.meta.guestOnly && isAuthenticated) {
    return '/';
  }

  return true;
});

export default router;
