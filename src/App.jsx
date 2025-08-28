@@ .. @@
 import './App.css'
-import Pages from "@/pages/index.jsx"
+import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
+import { AuthProvider } from './contexts/AuthContext'
+import ProtectedRoute from './components/ProtectedRoute'
+import Layout from './pages/Layout'
+import Dashboard from './pages/Dashboard'
+import NewVisit from './pages/NewVisit'
+import Reports from './pages/Reports'
+import Settings from './pages/Settings'
+import Admin from './pages/Admin'
+import Customers from './pages/Customers'
+import Configuration from './pages/Configuration'
+import Analytics from './pages/Analytics'
+import Login from './pages/Login'
 import { Toaster } from "@/components/ui/toaster"
 
 function App() {
   return (
-    <>
-      <Pages />
-      <Toaster />
-    </>
+    <AuthProvider>
+      <Router>
+        <Routes>
+          <Route path="/login" element={<Login />} />
+          <Route path="/*" element={
+            <ProtectedRoute>
+              <Layout>
+                <Routes>
+                  <Route path="/" element={<Dashboard />} />
+                  <Route path="/dashboard" element={<Dashboard />} />
+                  <Route path="/newvisit" element={<NewVisit />} />
+                  <Route path="/reports" element={<Reports />} />
+                  <Route path="/analytics" element={<Analytics />} />
+                  <Route path="/customers" element={<Customers />} />
+                  <Route path="/settings" element={<Settings />} />
+                  <Route path="/configuration" element={
+                    <ProtectedRoute requiredRole="admin">
+                      <Configuration />
+                    </ProtectedRoute>
+                  } />
+                  <Route path="/admin" element={
+                    <ProtectedRoute requiredRole="admin">
+                      <Admin />
+                    </ProtectedRoute>
+                  } />
+                </Routes>
+              </Layout>
+            </ProtectedRoute>
+          } />
+        </Routes>
+        <Toaster />
+      </Router>
+    </AuthProvider>
   )
 }
 
 export default App