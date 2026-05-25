import { defineConfig } from 'wxt';

export default defineConfig({
  modules: ['@wxt-dev/module-react'],
  manifest: {
    name: 'Inkwell',
    description: 'Save articles to your Inkwell knowledge base',
    permissions: ['activeTab', 'storage'],
    host_permissions: ['http://localhost/*', 'https://*/*'],
    action: { default_popup: 'popup.html', default_title: 'Inkwell' },
    options_ui: { page: 'options.html', open_in_tab: true },
  },
});
