import React, { useState, useEffect } from "react";
import "./App.css";
import { 
  Sprout, 
  Search, 
  SlidersHorizontal, 
  Calendar, 
  User, 
  LogOut, 
  Plus, 
  Trash2, 
  Edit3, 
  Check, 
  X, 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  Users, 
  Star, 
  Clock, 
  CreditCard, 
  FileText,
  Lock,
  Mail,
  Eye,
  EyeOff
} from "lucide-react";
import { initialEquipment } from "./data/initialData";

export default function App() {
  // --- Toast Notification System State ---
  const [toasts, setToasts] = useState([]);
  
  const showToast = (message, type = "success") => {
    const id = Date.now() + Math.random().toString(36).substr(2, 5);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  // --- Authentication & Session State ---
  const [currentUser, setCurrentUser] = useState(null);
  const [authMode, setAuthMode] = useState("login"); // "login" | "signup"
  const [showPassword, setShowPassword] = useState(false);
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [signupName, setSignupName] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [signupRole, setSignupRole] = useState("farmer"); // "farmer" | "admin"

  // --- Core Application State ---
  const [view, setView] = useState("marketplace"); // "marketplace" | "bookings" | "admin"
  const [equipmentList, setEquipmentList] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [users, setUsers] = useState([]);

  // --- Marketplace Filters State ---
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedSort, setSelectedSort] = useState("default"); // "default" | "lowToHigh" | "highToLow" | "rating"
  
  // --- Selected Item Detail Modal State ---
  const [selectedItem, setSelectedItem] = useState(null);
  const [bookingTab, setBookingTab] = useState("rent"); // "rent" | "buy"
  const [rentStartDate, setRentStartDate] = useState("");
  const [rentEndDate, setRentEndDate] = useState("");

  // --- Admin Panel Tabs & Forms State ---
  const [adminTab, setAdminTab] = useState("overview"); // "overview" | "inventory" | "orders" | "users"
  const [showItemForm, setShowItemForm] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  
  // Admin Item Form Fields
  const [formName, setFormName] = useState("");
  const [formCategory, setFormCategory] = useState("Tractors");
  const [formBrand, setFormBrand] = useState("");
  const [formPower, setFormPower] = useState("");
  const [formFuelType, setFormFuelType] = useState("Diesel");
  const [formRentalRate, setFormRentalRate] = useState(1000);
  const [formPurchasePrice, setFormPurchasePrice] = useState(150000);
  const [formStock, setFormStock] = useState(5);
  const [formDescription, setFormDescription] = useState("");
  const [formSpecs, setFormSpecs] = useState("Engine Power: 50 HP\nLifting Capacity: 1500 kg");
  const [formImageUrl, setFormImageUrl] = useState("");

  // --- LocalStorage Seeding & Initialization ---
  useEffect(() => {
    // 1. Initialize Users
    const savedUsers = localStorage.getItem("ky_users");
    let initializedUsers = [];
    if (savedUsers) {
      initializedUsers = JSON.parse(savedUsers);
    } else {
      initializedUsers = [
        { id: "u-1", name: "Admin Manager", email: "admin@kisanyantra.com", password: "admin123", role: "admin", status: "active" },
        { id: "u-2", name: "Ramesh Kumar", email: "farmer@field.com", password: "farmer123", role: "farmer", status: "active" },
        { id: "u-3", name: "Sahil Singh", email: "sahil@example.com", password: "sahil123", role: "farmer", status: "active" }
      ];
      localStorage.setItem("ky_users", JSON.stringify(initializedUsers));
    }
    setUsers(initializedUsers);

    // 2. Initialize Equipment
    const savedEquipment = localStorage.getItem("ky_equipment");
    let initializedEquipment = [];
    if (savedEquipment) {
      initializedEquipment = JSON.parse(savedEquipment);
    } else {
      initializedEquipment = initialEquipment;
      localStorage.setItem("ky_equipment", JSON.stringify(initializedEquipment));
    }
    setEquipmentList(initializedEquipment);

    // 3. Initialize Bookings
    const savedBookings = localStorage.getItem("ky_bookings");
    let initializedBookings = [];
    if (savedBookings) {
      initializedBookings = JSON.parse(savedBookings);
    } else {
      initializedBookings = [
        {
          id: "bk-1",
          userId: "u-2",
          userName: "Ramesh Kumar",
          equipmentId: "eq-1",
          equipmentName: "Mahindra Arjun Novo 605 DI Tractor",
          imageUrl: "/images/tractor.jpg",
          type: "rent",
          startDate: "2026-06-16",
          endDate: "2026-06-18",
          totalDays: 2,
          totalPrice: 3000,
          status: "approved",
          createdAt: "2026-06-15"
        },
        {
          id: "bk-2",
          userId: "u-3",
          userName: "Sahil Singh",
          equipmentId: "eq-4",
          equipmentName: "Sonalika Automatic Seed Drill",
          imageUrl: "/images/seed_drill.jpg",
          type: "buy",
          totalPrice: 95000,
          status: "pending",
          createdAt: "2026-06-15"
        }
      ];
      localStorage.setItem("ky_bookings", JSON.stringify(initializedBookings));
    }
    setBookings(initializedBookings);

    // 4. Initialize Active Session
    const savedSession = localStorage.getItem("ky_session");
    if (savedSession) {
      setCurrentUser(JSON.parse(savedSession));
    }
  }, []);

  // Sync state functions with LocalStorage
  const syncUsers = (newUsers) => {
    setUsers(newUsers);
    localStorage.setItem("ky_users", JSON.stringify(newUsers));
  };

  const syncEquipment = (newEquip) => {
    setEquipmentList(newEquip);
    localStorage.setItem("ky_equipment", JSON.stringify(newEquip));
  };

  const syncBookings = (newBookings) => {
    setBookings(newBookings);
    localStorage.setItem("ky_bookings", JSON.stringify(newBookings));
  };

  // --- Auth Handlers ---
  const handleLoginSubmit = (e) => {
    e.preventDefault();
    if (!loginEmail || !loginPassword) {
      showToast("Please fill in all fields", "error");
      return;
    }

    const foundUser = users.find(
      (u) => u.email.toLowerCase() === loginEmail.toLowerCase() && u.password === loginPassword
    );

    if (!foundUser) {
      showToast("Invalid email or password", "error");
      return;
    }

    if (foundUser.status === "blocked") {
      showToast("Your account has been suspended", "error");
      return;
    }

    setCurrentUser(foundUser);
    localStorage.setItem("ky_session", JSON.stringify(foundUser));
    setLoginEmail("");
    setLoginPassword("");
    showToast(`Welcome back, ${foundUser.name}!`, "success");
    setView("marketplace");
  };

  const handleSignupSubmit = (e) => {
    e.preventDefault();
    if (!signupName || !signupEmail || !signupPassword) {
      showToast("Please fill in all fields", "error");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(signupEmail)) {
      showToast("Please enter a valid email address", "error");
      return;
    }

    const existingUser = users.find((u) => u.email.toLowerCase() === signupEmail.toLowerCase());
    if (existingUser) {
      showToast("Email already registered", "error");
      return;
    }

    const newUser = {
      id: "u-" + (users.length + 1),
      name: signupName,
      email: signupEmail.toLowerCase(),
      password: signupPassword,
      role: signupRole,
      status: "active"
    };

    const updatedUsers = [...users, newUser];
    syncUsers(updatedUsers);
    
    // Automatically log in
    setCurrentUser(newUser);
    localStorage.setItem("ky_session", JSON.stringify(newUser));
    
    // Reset inputs
    setSignupName("");
    setSignupEmail("");
    setSignupPassword("");
    
    showToast(`Account created successfully as ${signupRole}!`, "success");
    setView("marketplace");
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem("ky_session");
    setView("marketplace");
    showToast("Logged out successfully", "info");
  };

  // --- Marketplace Filtering & Sorting ---
  const categories = ["All", "Tractors", "Drones & Tech", "Harvesters", "Planting & Sowing", "Irrigation", "Tillage & Preparation"];

  const filteredEquipment = equipmentList.filter((item) => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          item.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          item.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "All" || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  }).sort((a, b) => {
    if (selectedSort === "lowToHigh") return a.rentalRate - b.rentalRate;
    if (selectedSort === "highToLow") return b.rentalRate - a.rentalRate;
    if (selectedSort === "rating") return b.rating - a.rating;
    return 0; // Default unsorted
  });

  // --- Booking Operations ---
  const handleOpenDetailModal = (item) => {
    setSelectedItem(item);
    setBookingTab("rent");
    
    // Initialize dates to tomorrow and day after
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const dayAfter = new Date();
    dayAfter.setDate(dayAfter.getDate() + 2);
    
    setRentStartDate(tomorrow.toISOString().split('T')[0]);
    setRentEndDate(dayAfter.toISOString().split('T')[0]);
  };

  const calculateRentDays = () => {
    if (!rentStartDate || !rentEndDate) return 0;
    const start = new Date(rentStartDate);
    const end = new Date(rentEndDate);
    const diffTime = end - start;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  };

  const handleBook = () => {
    if (!currentUser) {
      showToast("Please login or register to book equipment", "error");
      setAuthMode("login");
      setSelectedItem(null);
      setView("auth");
      return;
    }

    if (selectedItem.stock <= 0) {
      showToast("This item is currently out of stock", "error");
      return;
    }

    if (bookingTab === "rent") {
      const days = calculateRentDays();
      if (days <= 0) {
        showToast("Invalid date selection. End date must be after start date.", "error");
        return;
      }
      
      const totalPrice = days * selectedItem.rentalRate;
      const newBooking = {
        id: "bk-" + (bookings.length + 1),
        userId: currentUser.id,
        userName: currentUser.name,
        equipmentId: selectedItem.id,
        equipmentName: selectedItem.name,
        imageUrl: selectedItem.imageUrl,
        type: "rent",
        startDate: rentStartDate,
        endDate: rentEndDate,
        totalDays: days,
        totalPrice: totalPrice,
        status: "pending",
        createdAt: new Date().toISOString().split('T')[0]
      };

      const updatedBookings = [newBooking, ...bookings];
      syncBookings(updatedBookings);

      // Reduce stock by 1
      const updatedEquipment = equipmentList.map((eq) => {
        if (eq.id === selectedItem.id) {
          return { ...eq, stock: eq.stock - 1 };
        }
        return eq;
      });
      syncEquipment(updatedEquipment);

      showToast(`Rental request submitted for ${days} days! Total: ₹${totalPrice.toLocaleString()}`, "success");
    } else {
      // Purchase Flow
      const newBooking = {
        id: "bk-" + (bookings.length + 1),
        userId: currentUser.id,
        userName: currentUser.name,
        equipmentId: selectedItem.id,
        equipmentName: selectedItem.name,
        imageUrl: selectedItem.imageUrl,
        type: "buy",
        totalPrice: selectedItem.purchasePrice,
        status: "pending",
        createdAt: new Date().toISOString().split('T')[0]
      };

      const updatedBookings = [newBooking, ...bookings];
      syncBookings(updatedBookings);

      // Reduce stock by 1
      const updatedEquipment = equipmentList.map((eq) => {
        if (eq.id === selectedItem.id) {
          return { ...eq, stock: eq.stock - 1 };
        }
        return eq;
      });
      syncEquipment(updatedEquipment);

      showToast(`Purchase order placed for ₹${selectedItem.purchasePrice.toLocaleString()}!`, "success");
    }

    setSelectedItem(null);
  };

  // --- Admin CRUD Actions ---
  const handleOpenItemForm = (item = null) => {
    if (item) {
      setEditingItem(item);
      setFormName(item.name);
      setFormCategory(item.category);
      setFormBrand(item.brand);
      setFormPower(item.power);
      setFormFuelType(item.fuelType);
      setFormRentalRate(item.rentalRate);
      setFormPurchasePrice(item.purchasePrice);
      setFormStock(item.stock);
      setFormDescription(item.description);
      setFormImageUrl(item.imageUrl);
      
      const specsString = Object.entries(item.specs || {})
        .map(([k, v]) => `${k}: ${v}`)
        .join("\n");
      setFormSpecs(specsString);
    } else {
      setEditingItem(null);
      setFormName("");
      setFormCategory("Tractors");
      setFormBrand("");
      setFormPower("");
      setFormFuelType("Diesel");
      setFormRentalRate(1000);
      setFormPurchasePrice(150000);
      setFormStock(5);
      setFormDescription("");
      setFormSpecs("Engine Power: 50 HP\nLifting Capacity: 1500 kg");
      setFormImageUrl("");
    }
    setShowItemForm(true);
  };

  const handleSaveItem = (e) => {
    e.preventDefault();
    if (!formName || !formBrand || !formDescription) {
      showToast("Please fill in required fields", "error");
      return;
    }

    // Parse specs from text format "Key: Value\nKey2: Value2"
    const parsedSpecs = {};
    formSpecs.split("\n").forEach((line) => {
      const parts = line.split(":");
      if (parts.length >= 2) {
        parsedSpecs[parts[0].trim()] = parts.slice(1).join(":").trim();
      }
    });

    const finalImage = formImageUrl || "/images/custom_instrument.jpg";

    if (editingItem) {
      // Edit mode
      const updatedEquipment = equipmentList.map((eq) => {
        if (eq.id === editingItem.id) {
          return {
            ...eq,
            name: formName,
            category: formCategory,
            brand: formBrand,
            power: formPower,
            fuelType: formFuelType,
            rentalRate: Number(formRentalRate),
            purchasePrice: Number(formPurchasePrice),
            stock: Number(formStock),
            description: formDescription,
            specs: parsedSpecs,
            imageUrl: finalImage
          };
        }
        return eq;
      });
      syncEquipment(updatedEquipment);
      showToast("Equipment updated successfully", "success");
    } else {
      // Create mode
      const newItem = {
        id: "eq-" + (equipmentList.length + 1),
        name: formName,
        category: formCategory,
        brand: formBrand,
        power: formPower,
        fuelType: formFuelType,
        rentalRate: Number(formRentalRate),
        purchasePrice: Number(formPurchasePrice),
        stock: Number(formStock),
        availability: true,
        rating: 4.5,
        reviewsCount: 1,
        description: formDescription,
        specs: parsedSpecs,
        imageUrl: finalImage
      };
      syncEquipment([...equipmentList, newItem]);
      showToast("New equipment added to catalog", "success");
    }

    setShowItemForm(false);
  };

  const handleDeleteItem = (itemId) => {
    if (confirm("Are you sure you want to remove this equipment from the platform?")) {
      const updatedEquipment = equipmentList.filter((eq) => eq.id !== itemId);
      syncEquipment(updatedEquipment);
      showToast("Equipment removed successfully", "info");
    }
  };

  // --- Admin Booking/Orders management ---
  const handleUpdateBookingStatus = (bookingId, newStatus) => {
    const updatedBookings = bookings.map((bk) => {
      if (bk.id === bookingId) {
        // If status changes to completed/returned, we restore item stock by 1
        if (newStatus === "completed" && bk.type === "rent") {
          const updatedEquipment = equipmentList.map((eq) => {
            if (eq.id === bk.equipmentId) {
              return { ...eq, stock: eq.stock + 1 };
            }
            return eq;
          });
          syncEquipment(updatedEquipment);
        }
        return { ...bk, status: newStatus };
      }
      return bk;
    });
    
    syncBookings(updatedBookings);
    showToast(`Order status updated to ${newStatus}`, "success");
  };

  // --- Admin User Management Actions ---
  const handleToggleUserRole = (userId) => {
    const updatedUsers = users.map((u) => {
      if (u.id === userId) {
        const newRole = u.role === "admin" ? "farmer" : "admin";
        return { ...u, role: newRole };
      }
      return u;
    });
    syncUsers(updatedUsers);
    showToast("User role updated", "success");
  };

  const handleToggleUserBlock = (userId) => {
    const updatedUsers = users.map((u) => {
      if (u.id === userId) {
        const newStatus = u.status === "blocked" ? "active" : "blocked";
        return { ...u, status: newStatus };
      }
      return u;
    });
    syncUsers(updatedUsers);
    showToast("User status updated", "info");
  };

  // --- Admin Analytics calculations ---
  const totalRevenue = bookings
    .filter((b) => b.status === "approved" || b.status === "completed")
    .reduce((acc, curr) => acc + curr.totalPrice, 0);

  const activeRentalsCount = bookings.filter((b) => b.type === "rent" && b.status === "approved").length;

  const totalUsersCount = users.length;
  const totalEquipmentCount = equipmentList.length;

  return (
    <div className="app-container">
      {/* Toast Portal */}
      <div className="toast-container">
        {toasts.map((toast) => (
          <div key={toast.id} className={`toast ${toast.type}`}>
            <span style={{ fontSize: "1.1rem" }}>
              {toast.type === "success" && <Check color="#10B981" />}
              {toast.type === "error" && <X color="#EF4444" />}
              {toast.type === "info" && <Sprout color="#3B82F6" />}
            </span>
            <span>{toast.message}</span>
          </div>
        ))}
      </div>

      {/* Navigation Header */}
      <header className="navbar">
        <div className="nav-brand" onClick={() => setView("marketplace")}>
          <Sprout className="brand-icon" size={28} />
          <span>Kisan<span className="brand-span">Yantra</span></span>
        </div>

        <nav className="nav-links">
          <span 
            className={`nav-link ${view === "marketplace" ? "active" : ""}`} 
            onClick={() => setView("marketplace")}
          >
            Marketplace
          </span>

          {currentUser && currentUser.role === "farmer" && (
            <span 
              className={`nav-link ${view === "bookings" ? "active" : ""}`} 
              onClick={() => setView("bookings")}
            >
              My Bookings
            </span>
          )}

          {currentUser && currentUser.role === "admin" && (
            <span 
              className={`nav-link ${view === "admin" ? "active" : ""}`} 
              onClick={() => { setView("admin"); setAdminTab("overview"); }}
            >
              Admin Panel
            </span>
          )}

          {currentUser ? (
            <div className="user-profile-badge">
              <User size={16} color="#10B981" />
              <div style={{ display: "flex", flexDirection: "column" }}>
                <span style={{ fontSize: "0.85rem", fontWeight: "600", color: "#ffffff" }}>
                  {currentUser.name.split(" ")[0]}
                </span>
                <span className="profile-role-tag">{currentUser.role}</span>
              </div>
              <button className="btn-logout" title="Log Out" onClick={handleLogout}>
                <LogOut size={16} />
              </button>
            </div>
          ) : (
            <button 
              className="btn-primary" 
              style={{ width: "auto", padding: "0.5rem 1.25rem", fontSize: "0.9rem" }}
              onClick={() => { setAuthMode("login"); setView("auth"); }}
            >
              Login / Sign Up
            </button>
          )}
        </nav>
      </header>

      {/* Page Routing */}
      {view === "auth" && (
        <main className="auth-page">
          <div className="auth-card">
            <div className="auth-header">
              <div className="auth-logo">
                <Sprout size={36} />
              </div>
              <h2 className="auth-title">
                {authMode === "login" ? "Welcome to KisanYantra" : "Create Farmer Account"}
              </h2>
              <p className="auth-subtitle">
                {authMode === "login" 
                  ? "Access top quality agricultural machinery for your farm" 
                  : "Join our platform to start booking state-of-the-art tools"}
              </p>
            </div>

            {authMode === "login" ? (
              <form className="auth-form" onSubmit={handleLoginSubmit}>
                <div className="form-group">
                  <label className="form-label">Email Address</label>
                  <div className="input-wrapper">
                    <Mail className="input-icon" size={18} />
                    <input 
                      type="email" 
                      className="form-input" 
                      placeholder="farmer@field.com"
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Password</label>
                  <div className="input-wrapper">
                    <Lock className="input-icon" size={18} />
                    <input 
                      type={showPassword ? "text" : "password"} 
                      className="form-input" 
                      placeholder="••••••••"
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                    />
                    <button 
                      type="button" 
                      onClick={() => setShowPassword(!showPassword)}
                      style={{ position: "absolute", right: "1rem", background: "none", border: "none", cursor: "pointer", color: "#64748b" }}
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                <button type="submit" className="btn-primary" style={{ marginTop: "0.5rem" }}>
                  Sign In
                </button>

                <div className="auth-toggle">
                  Don't have an account? 
                  <span className="auth-toggle-link" onClick={() => setAuthMode("signup")}>Register Here</span>
                </div>
              </form>
            ) : (
              <form className="auth-form" onSubmit={handleSignupSubmit}>
                <div className="form-group">
                  <label className="form-label">Full Name</label>
                  <div className="input-wrapper">
                    <User className="input-icon" size={18} />
                    <input 
                      type="text" 
                      className="form-input" 
                      placeholder="Sahil Singh"
                      value={signupName}
                      onChange={(e) => setSignupName(e.target.value)}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Email Address</label>
                  <div className="input-wrapper">
                    <Mail className="input-icon" size={18} />
                    <input 
                      type="email" 
                      className="form-input" 
                      placeholder="farmer@example.com"
                      value={signupEmail}
                      onChange={(e) => setSignupEmail(e.target.value)}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Password</label>
                  <div className="input-wrapper">
                    <Lock className="input-icon" size={18} />
                    <input 
                      type={showPassword ? "text" : "password"} 
                      className="form-input" 
                      placeholder="••••••••"
                      value={signupPassword}
                      onChange={(e) => setSignupPassword(e.target.value)}
                    />
                    <button 
                      type="button" 
                      onClick={() => setShowPassword(!showPassword)}
                      style={{ position: "absolute", right: "1rem", background: "none", border: "none", cursor: "pointer", color: "#64748b" }}
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Account Role</label>
                  <div className="select-role-container">
                    <div 
                      className={`role-option ${signupRole === "farmer" ? "selected" : ""}`}
                      onClick={() => setSignupRole("farmer")}
                    >
                      <User size={20} color={signupRole === "farmer" ? "#10B981" : "#64748b"} />
                      <span className="role-title">Farmer</span>
                      <span className="role-desc">Rent or purchase tools for your field</span>
                    </div>

                    <div 
                      className={`role-option ${signupRole === "admin" ? "selected" : ""}`}
                      onClick={() => setSignupRole("admin")}
                    >
                      <LayoutDashboard size={20} color={signupRole === "admin" ? "#10B981" : "#64748b"} />
                      <span className="role-title">Admin</span>
                      <span className="role-desc">Manage catalog and platform operations</span>
                    </div>
                  </div>
                </div>

                <button type="submit" className="btn-primary" style={{ marginTop: "0.5rem" }}>
                  Create Account
                </button>

                <div className="auth-toggle">
                  Already have an account? 
                  <span className="auth-toggle-link" onClick={() => setAuthMode("login")}>Sign In</span>
                </div>
              </form>
            )}
          </div>
        </main>
      )}

      {view === "marketplace" && (
        <main className="marketplace-container">
          <section className="hero-banner">
            <h1 className="hero-title">High-Tech Farm Machinery, At Your Fingertips</h1>
            <p className="hero-subtitle">
              Rent or purchase modern agricultural instruments tailored to skyrocket your harvest yield. High quality, verified, and serviced machinery.
            </p>
          </section>

          {/* Filtering and Toolbar */}
          <div className="toolbar-container">
            <div className="search-filter-row">
              <div className="search-input-wrapper">
                <Search className="search-icon" size={18} />
                <input 
                  type="text" 
                  className="search-input" 
                  placeholder="Search tractors, drones, harvesters..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              <select 
                className="filter-select"
                value={selectedSort}
                onChange={(e) => setSelectedSort(e.target.value)}
              >
                <option value="default">Sort: Recommended</option>
                <option value="lowToHigh">Rent: Low to High</option>
                <option value="highToLow">Rent: High to Low</option>
                <option value="rating">Top Rated</option>
              </select>

              <select 
                className="filter-select"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                <option value="All">Category: All</option>
                <option value="Tractors">Tractors</option>
                <option value="Drones & Tech">Drones & Tech</option>
                <option value="Harvesters">Harvesters</option>
                <option value="Planting & Sowing">Planting & Sowing</option>
                <option value="Irrigation">Irrigation</option>
                <option value="Tillage & Preparation">Tillage & Preparation</option>
              </select>
            </div>

            <div className="tags-row">
              <span className="tag-label"><SlidersHorizontal size={14} style={{ display: "inline", marginRight: "4px", verticalAlign: "middle" }} /> Categories:</span>
              {categories.map((cat) => (
                <span 
                  key={cat}
                  className={`category-tag ${selectedCategory === cat ? "active" : ""}`}
                  onClick={() => setSelectedCategory(cat)}
                >
                  {cat}
                </span>
              ))}
            </div>
          </div>

          {/* Catalog Grid */}
          {filteredEquipment.length === 0 ? (
            <div style={{ textAlign: "center", padding: "4rem 2rem", background: "var(--bg-card-dark)", borderRadius: "16px", border: "1px solid var(--border-dark)" }}>
              <Sprout size={48} color="#64748b" style={{ marginBottom: "1rem" }} />
              <h3>No equipment matches your search filter</h3>
              <p style={{ color: "var(--text-dark-secondary)", marginTop: "0.5rem" }}>Try adjusting your search terms or resetting filters.</p>
            </div>
          ) : (
            <div className="equipment-grid">
              {filteredEquipment.map((item) => (
                <article key={item.id} className="equipment-card">
                  <div className="card-image-container">
                    <img 
                      src={item.imageUrl} 
                      alt={item.name} 
                      className="card-image"
                      onError={(e) => { e.target.src = "https://images.unsplash.com/photo-1593113630400-ea4288922497?auto=format&fit=crop&q=80&w=500"; }}
                    />
                    <span className="category-badge">{item.category}</span>
                    <span className="rating-badge">
                      <Star size={12} fill="#000000" />
                      {item.rating}
                    </span>
                  </div>

                  <div className="card-content">
                    <span className="card-brand">{item.brand}</span>
                    <h3 className="card-title">{item.name}</h3>
                    <p className="card-description">{item.description}</p>
                    
                    <div className="card-prices">
                      <div className="price-item">
                        <span className="price-label">Daily Rental</span>
                        <span className="price-val rental">₹{item.rentalRate.toLocaleString()}<span>/day</span></span>
                      </div>
                      <div className="price-item">
                        <span className="price-label">Outright Purchase</span>
                        <span className="price-val">₹{item.purchasePrice.toLocaleString()}</span>
                      </div>
                    </div>

                    <div className="card-actions">
                      <button className="btn-card" onClick={() => handleOpenDetailModal(item)}>
                        Explore & Book <ShoppingCart size={16} />
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </main>
      )}

      {view === "bookings" && currentUser && (
        <main className="profile-container">
          <div className="page-header">
            <h1 className="page-title">My Farm Bookings & Orders</h1>
            <p className="page-subtitle">Track the status of your equipment rentals and purchases here.</p>
          </div>

          {bookings.filter((b) => b.userId === currentUser.id).length === 0 ? (
            <div style={{ textAlign: "center", padding: "4rem 2rem", background: "var(--bg-card-dark)", borderRadius: "16px", border: "1px solid var(--border-dark)" }}>
              <ShoppingCart size={48} color="#64748b" style={{ marginBottom: "1rem" }} />
              <h3>You haven't made any bookings yet</h3>
              <p style={{ color: "var(--text-dark-secondary)", marginTop: "0.5rem" }}>Head back to the marketplace to browse and book tools.</p>
              <button className="btn-primary" style={{ width: "auto", marginTop: "1.5rem", padding: "0.6rem 1.5rem" }} onClick={() => setView("marketplace")}>
                Go to Marketplace
              </button>
            </div>
          ) : (
            <div className="bookings-list">
              {bookings.filter((b) => b.userId === currentUser.id).map((bk) => (
                <div key={bk.id} className="booking-item-card">
                  <img 
                    src={bk.imageUrl} 
                    alt={bk.equipmentName} 
                    className="booking-item-img"
                    onError={(e) => { e.target.src = "https://images.unsplash.com/photo-1593113630400-ea4288922497?auto=format&fit=crop&q=80&w=500"; }}
                  />
                  <div className="booking-item-details">
                    <div style={{ display: "flex", justifyContent: "between", alignItems: "center", width: "100%", flexWrap: "wrap", gap: "1rem" }}>
                      <h3 className="booking-item-title">{bk.equipmentName}</h3>
                      <span className={`booking-badge ${bk.status}`}>
                        {bk.status}
                      </span>
                    </div>

                    <div className="booking-item-meta">
                      <span style={{ textTransform: "uppercase", fontWeight: "700", color: bk.type === "rent" ? "#10B981" : "#fbbf24" }}>
                        <CreditCard size={14} /> {bk.type}
                      </span>
                      <span>
                        <Clock size={14} /> Booked on {bk.createdAt}
                      </span>
                      {bk.type === "rent" && (
                        <span>
                          <Calendar size={14} /> {bk.startDate} to {bk.endDate} ({bk.totalDays} Days)
                        </span>
                      )}
                      <span style={{ fontWeight: "700", color: "#ffffff" }}>
                        Cost: ₹{bk.totalPrice.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      )}

      {view === "admin" && currentUser && currentUser.role === "admin" && (
        <main className="admin-container">
          <aside className="admin-sidebar">
            <button 
              className={`admin-side-btn ${adminTab === "overview" ? "active" : ""}`}
              onClick={() => setAdminTab("overview")}
            >
              <LayoutDashboard size={18} /> Overview
            </button>
            <button 
              className={`admin-side-btn ${adminTab === "inventory" ? "active" : ""}`}
              onClick={() => setAdminTab("inventory")}
            >
              <Package size={18} /> Equipment Inventory
            </button>
            <button 
              className={`admin-side-btn ${adminTab === "orders" ? "active" : ""}`}
              onClick={() => setAdminTab("orders")}
            >
              <ShoppingCart size={18} /> Orders & Rentals
            </button>
            <button 
              className={`admin-side-btn ${adminTab === "users" ? "active" : ""}`}
              onClick={() => setAdminTab("users")}
            >
              <Users size={18} /> User Management
            </button>
          </aside>

          <section className="admin-content">
            {adminTab === "overview" && (
              <div>
                <div className="page-header">
                  <h1 className="page-title">Admin Dashboard</h1>
                  <p className="page-subtitle">Track KisanYantra platform usage, bookings, and revenue metrics.</p>
                </div>

                <div className="admin-stats-grid">
                  <div className="admin-stat-card">
                    <div className="stat-icon-container" style={{ background: "rgba(16, 185, 129, 0.1)", color: "#10B981" }}>
                      <CreditCard size={24} />
                    </div>
                    <div className="stat-details">
                      <span className="stat-val">₹{totalRevenue.toLocaleString()}</span>
                      <span className="stat-lbl">Platform Revenue</span>
                    </div>
                  </div>

                  <div className="admin-stat-card">
                    <div className="stat-icon-container" style={{ background: "rgba(59, 130, 246, 0.1)", color: "#3B82F6" }}>
                      <Calendar size={24} />
                    </div>
                    <div className="stat-details">
                      <span className="stat-val">{activeRentalsCount}</span>
                      <span className="stat-lbl">Active Rentals</span>
                    </div>
                  </div>

                  <div className="admin-stat-card">
                    <div className="stat-icon-container" style={{ background: "rgba(245, 158, 11, 0.1)", color: "#F59E0B" }}>
                      <Users size={24} />
                    </div>
                    <div className="stat-details">
                      <span className="stat-val">{totalUsersCount}</span>
                      <span className="stat-lbl">Registered Users</span>
                    </div>
                  </div>

                  <div className="admin-stat-card">
                    <div className="stat-icon-container" style={{ background: "rgba(139, 92, 246, 0.1)", color: "#8B5CF6" }}>
                      <Package size={24} />
                    </div>
                    <div className="stat-details">
                      <span className="stat-val">{totalEquipmentCount}</span>
                      <span className="stat-lbl">Equipment Catalog</span>
                    </div>
                  </div>
                </div>

                {/* SVG Visual Chart */}
                <div className="charts-grid">
                  <div className="chart-card">
                    <h3 className="chart-title">Simulated Monthly Revenue Trend (2026)</h3>
                    <div className="svg-chart-container">
                      <div className="svg-chart-bar" style={{ height: "40%" }}>
                        <span className="bar-val">₹12k</span>
                        <span className="bar-lbl">Jan</span>
                      </div>
                      <div className="svg-chart-bar" style={{ height: "55%" }}>
                        <span className="bar-val">₹18k</span>
                        <span className="bar-lbl">Feb</span>
                      </div>
                      <div className="svg-chart-bar" style={{ height: "70%" }}>
                        <span className="bar-val">₹25k</span>
                        <span className="bar-lbl">Mar</span>
                      </div>
                      <div className="svg-chart-bar" style={{ height: "95%" }}>
                        <span className="bar-val">₹38k</span>
                        <span className="bar-lbl">Apr</span>
                      </div>
                      <div className="svg-chart-bar" style={{ height: "80%" }}>
                        <span className="bar-val">₹30k</span>
                        <span className="bar-lbl">May</span>
                      </div>
                      <div className="svg-chart-bar" style={{ height: "99%" }}>
                        <span className="bar-val">₹42k</span>
                        <span className="bar-lbl">Jun</span>
                      </div>
                    </div>
                  </div>

                  <div className="chart-card" style={{ display: "flex", flexDirection: "column", justifyContent: "center" }}>
                    <h3 className="chart-title">System Status Overview</h3>
                    <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.85rem", borderBottom: "1px solid rgba(16,185,129,0.1)", paddingBottom: "0.5rem" }}>
                        <span>Database Server</span>
                        <span style={{ color: "#10b981", fontWeight: "700" }}>ONLINE (LOCAL)</span>
                      </div>
                      <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.85rem", borderBottom: "1px solid rgba(16,185,129,0.1)", paddingBottom: "0.5rem" }}>
                        <span>Image Server</span>
                        <span style={{ color: "#10b981", fontWeight: "700" }}>ACTIVE</span>
                      </div>
                      <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.85rem", borderBottom: "1px solid rgba(16,185,129,0.1)", paddingBottom: "0.5rem" }}>
                        <span>Pending Approvals</span>
                        <span style={{ color: "#f59e0b", fontWeight: "700" }}>
                          {bookings.filter((b) => b.status === "pending").length} Requests
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {adminTab === "inventory" && (
              <div>
                <div className="section-header-row">
                  <div>
                    <h2 style={{ fontSize: "1.5rem" }}>Equipment Catalog</h2>
                    <p style={{ fontSize: "0.85rem", color: "var(--text-dark-secondary)" }}>Create, edit, or delete agricultural instruments.</p>
                  </div>
                  <button className="btn-primary btn-action" onClick={() => handleOpenItemForm()}>
                    <Plus size={16} /> Add Equipment
                  </button>
                </div>

                <div className="table-container">
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>Image</th>
                        <th>Name</th>
                        <th>Category</th>
                        <th>Brand</th>
                        <th>Rates (Rent / Buy)</th>
                        <th>Stock</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {equipmentList.map((eq) => (
                        <tr key={eq.id}>
                          <td>
                            <img 
                              src={eq.imageUrl} 
                              alt={eq.name} 
                              className="table-img"
                              onError={(e) => { e.target.src = "https://images.unsplash.com/photo-1593113630400-ea4288922497?auto=format&fit=crop&q=80&w=500"; }}
                            />
                          </td>
                          <td style={{ fontWeight: "600" }}>{eq.name}</td>
                          <td>{eq.category}</td>
                          <td>{eq.brand}</td>
                          <td>
                            <div style={{ display: "flex", flexDirection: "column" }}>
                              <span style={{ color: "var(--primary-light)" }}>Rent: ₹{eq.rentalRate}/day</span>
                              <span style={{ fontSize: "0.8rem", color: "var(--text-dark-secondary)" }}>Buy: ₹{eq.purchasePrice.toLocaleString()}</span>
                            </div>
                          </td>
                          <td>{eq.stock} left</td>
                          <td>
                            <div className="actions-cell">
                              <button 
                                className="btn-table-action edit" 
                                title="Edit Item"
                                onClick={() => handleOpenItemForm(eq)}
                              >
                                <Edit3 size={14} />
                              </button>
                              <button 
                                className="btn-table-action delete" 
                                title="Delete Item"
                                onClick={() => handleDeleteItem(eq.id)}
                              >
                                <Trash2 size={14} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {adminTab === "orders" && (
              <div>
                <div className="page-header">
                  <h2 style={{ fontSize: "1.5rem" }}>Order & Rental Requests</h2>
                  <p style={{ fontSize: "0.85rem", color: "var(--text-dark-secondary)" }}>Review customer booking requests, approve transactions, and track active rentals.</p>
                </div>

                <div className="table-container">
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>Customer</th>
                        <th>Equipment</th>
                        <th>Type</th>
                        <th>Details / Dates</th>
                        <th>Cost</th>
                        <th>Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {bookings.map((bk) => (
                        <tr key={bk.id}>
                          <td>{bk.id}</td>
                          <td style={{ fontWeight: "600" }}>{bk.userName}</td>
                          <td>{bk.equipmentName}</td>
                          <td style={{ textTransform: "uppercase", fontWeight: "700", fontSize: "0.8rem", color: bk.type === "rent" ? "#10B981" : "#fbbf24" }}>{bk.type}</td>
                          <td>
                            {bk.type === "rent" ? (
                              <span style={{ fontSize: "0.85rem" }}>{bk.startDate} to {bk.endDate} ({bk.totalDays} days)</span>
                            ) : (
                              <span style={{ color: "var(--text-dark-secondary)" }}>Outright Purchase</span>
                            )}
                          </td>
                          <td style={{ fontWeight: "700" }}>₹{bk.totalPrice.toLocaleString()}</td>
                          <td>
                            <span className={`booking-badge ${bk.status}`}>{bk.status}</span>
                          </td>
                          <td>
                            <div className="actions-cell">
                              {bk.status === "pending" && (
                                <>
                                  <button 
                                    className="btn-table-action approve" 
                                    title="Approve Order"
                                    onClick={() => handleUpdateBookingStatus(bk.id, "approved")}
                                  >
                                    <Check size={14} />
                                  </button>
                                  <button 
                                    className="btn-table-action reject" 
                                    title="Reject Order"
                                    onClick={() => handleUpdateBookingStatus(bk.id, "rejected")}
                                  >
                                    <X size={14} />
                                  </button>
                                </>
                              )}

                              {bk.status === "approved" && bk.type === "rent" && (
                                <button 
                                  className="btn-primary" 
                                  style={{ padding: "0.3rem 0.75rem", fontSize: "0.8rem", width: "auto" }}
                                  onClick={() => handleUpdateBookingStatus(bk.id, "completed")}
                                >
                                  Mark Returned
                                </button>
                              )}

                              {(bk.status === "completed" || bk.status === "rejected") && (
                                <span style={{ fontSize: "0.8rem", color: "var(--text-dark-secondary)" }}>Processed</span>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {adminTab === "users" && (
              <div>
                <div className="page-header">
                  <h2 style={{ fontSize: "1.5rem" }}>User Account Directory</h2>
                  <p style={{ fontSize: "0.85rem", color: "var(--text-dark-secondary)" }}>View user logins, toggle administrator privileges, and moderate accounts.</p>
                </div>

                <div className="table-container">
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Role</th>
                        <th>Account Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.map((u) => (
                        <tr key={u.id}>
                          <td>{u.id}</td>
                          <td style={{ fontWeight: "600" }}>{u.name}</td>
                          <td>{u.email}</td>
                          <td>
                            <span className="profile-role-tag" style={{ background: u.role === "admin" ? "var(--accent)" : "#10b981" }}>
                              {u.role}
                            </span>
                          </td>
                          <td>
                            <span style={{ 
                              padding: "0.25rem 0.5rem", 
                              borderRadius: "4px", 
                              fontSize: "0.8rem", 
                              fontWeight: "700",
                              background: u.status === "blocked" ? "rgba(239, 68, 68, 0.15)" : "rgba(16, 185, 129, 0.15)",
                              color: u.status === "blocked" ? "#ef4444" : "#10b981"
                            }}>
                              {u.status}
                            </span>
                          </td>
                          <td>
                            <div className="actions-cell">
                              <button 
                                className="btn-primary" 
                                style={{ padding: "0.35rem 0.75rem", fontSize: "0.8rem", width: "auto", background: "rgba(0,0,0,0.3)", border: "1px solid var(--border-dark)" }}
                                onClick={() => handleToggleUserRole(u.id)}
                              >
                                Toggle Role
                              </button>
                              <button 
                                className="btn-primary" 
                                style={{ 
                                  padding: "0.35rem 0.75rem", 
                                  fontSize: "0.8rem", 
                                  width: "auto", 
                                  background: u.status === "blocked" ? "var(--success)" : "var(--error)" 
                                }}
                                onClick={() => handleToggleUserBlock(u.id)}
                              >
                                {u.status === "blocked" ? "Unblock" : "Block"}
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </section>
        </main>
      )}

      {/* FOOTER */}
      <footer style={{ marginTop: "auto", borderTop: "1px solid var(--border-dark)", padding: "1.5rem 2rem", background: "var(--bg-dark)", textAlign: "center", color: "var(--text-dark-secondary)", fontSize: "0.85rem" }}>
        <p>© 2026 KisanYantra Agriculture Hub. Developed for farmers across India. Empowering rural agriculture.</p>
      </footer>

      {/* ----------------- MODALS ----------------- */}

      {/* 1. Item Detail & Booking Modal */}
      {selectedItem && (
        <div className="modal-overlay" onClick={() => setSelectedItem(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="btn-close-modal" onClick={() => setSelectedItem(null)}>
              <X size={20} />
            </button>

            <div className="modal-grid">
              <div className="modal-visuals">
                <div className="modal-img-container">
                  <img 
                    src={selectedItem.imageUrl} 
                    alt={selectedItem.name} 
                    className="modal-img"
                    onError={(e) => { e.target.src = "https://images.unsplash.com/photo-1593113630400-ea4288922497?auto=format&fit=crop&q=80&w=500"; }}
                  />
                </div>

                <div className="modal-specs-box">
                  <h4 className="modal-specs-title">Technical Specifications</h4>
                  <div className="specs-list">
                    {Object.entries(selectedItem.specs || {}).map(([key, val]) => (
                      <div key={key} className="spec-row">
                        <span className="spec-name">{key}</span>
                        <span className="spec-value">{val}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="modal-details">
                <div>
                  <span className="modal-brand">{selectedItem.brand}</span>
                  <h2 className="modal-title">{selectedItem.name}</h2>
                  <p className="modal-desc">{selectedItem.description}</p>
                </div>

                <div className="booking-section">
                  <div className="booking-tabs">
                    <button 
                      className={`booking-tab ${bookingTab === "rent" ? "active" : ""}`}
                      onClick={() => setBookingTab("rent")}
                    >
                      Rent Equipment
                    </button>
                    <button 
                      className={`booking-tab ${bookingTab === "buy" ? "active" : ""}`}
                      onClick={() => setBookingTab("buy")}
                    >
                      Purchase Outright
                    </button>
                  </div>

                  <div className="booking-price-display">
                    <span className="booking-price-lbl">
                      {bookingTab === "rent" ? "Daily Rent Rate" : "Full Purchase Price"}
                    </span>
                    <div className="booking-price-val">
                      ₹{bookingTab === "rent" 
                        ? `${selectedItem.rentalRate.toLocaleString()}` 
                        : `${selectedItem.purchasePrice.toLocaleString()}`}
                      {bookingTab === "rent" && <span>/day</span>}
                    </div>
                  </div>

                  {bookingTab === "rent" && (
                    <div className="rental-date-inputs">
                      <div className="form-group">
                        <label className="form-label" style={{ fontSize: "0.75rem" }}>Start Date</label>
                        <input 
                          type="date" 
                          className="date-input"
                          value={rentStartDate}
                          min={new Date().toISOString().split('T')[0]}
                          onChange={(e) => setRentStartDate(e.target.value)}
                        />
                      </div>
                      <div className="form-group">
                        <label className="form-label" style={{ fontSize: "0.75rem" }}>End Date</label>
                        <input 
                          type="date" 
                          className="date-input"
                          value={rentEndDate}
                          min={rentStartDate || new Date().toISOString().split('T')[0]}
                          onChange={(e) => setRentEndDate(e.target.value)}
                        />
                      </div>
                    </div>
                  )}

                  <div className="booking-summary-row">
                    <span>
                      {bookingTab === "rent" 
                        ? `Booking Summary (${calculateRentDays()} days)` 
                        : "Outright Buy Order Summary"}
                    </span>
                    <span className="summary-total-price">
                      ₹{bookingTab === "rent" 
                        ? (calculateRentDays() * selectedItem.rentalRate).toLocaleString()
                        : selectedItem.purchasePrice.toLocaleString()}
                    </span>
                  </div>

                  <button 
                    className="btn-primary" 
                    onClick={handleBook}
                    disabled={selectedItem.stock <= 0}
                    style={{ background: selectedItem.stock <= 0 ? "#4b5563" : "" }}
                  >
                    {selectedItem.stock <= 0 
                      ? "Temporarily Out of Stock" 
                      : bookingTab === "rent" 
                        ? "Request Equipment Rental" 
                        : "Place Equipment Purchase Order"}
                  </button>
                  <p style={{ fontSize: "0.7rem", color: "var(--text-dark-secondary)", textAlign: "center", marginTop: "0.5rem" }}>
                    *Approval will be reviewed by administrators within 2 hours.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. Admin Inventory Add/Edit Modal */}
      {showItemForm && (
        <div className="modal-overlay" onClick={() => setShowItemForm(false)}>
          <div className="modal-content admin-form-modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: "650px" }}>
            <button className="btn-close-modal" onClick={() => setShowItemForm(false)}>
              <X size={20} />
            </button>

            <h2 style={{ fontSize: "1.5rem", marginBottom: "1.5rem" }}>
              {editingItem ? "Edit Equipment Record" : "Add New Equipment"}
            </h2>

            <form onSubmit={handleSaveItem}>
              <div className="admin-form-grid">
                <div className="form-group">
                  <label className="form-label">Equipment Name *</label>
                  <input 
                    type="text" 
                    className="form-input" 
                    style={{ paddingLeft: "1rem" }}
                    placeholder="e.g., John Deere Tractor Model X"
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Brand / Manufacturer *</label>
                  <input 
                    type="text" 
                    className="form-input" 
                    style={{ paddingLeft: "1rem" }}
                    placeholder="e.g., John Deere, Sonalika"
                    value={formBrand}
                    onChange={(e) => setFormBrand(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Category</label>
                  <select 
                    className="filter-select"
                    style={{ padding: "0.75rem 1rem" }}
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value)}
                  >
                    <option value="Tractors">Tractors</option>
                    <option value="Drones & Tech">Drones & Tech</option>
                    <option value="Harvesters">Harvesters</option>
                    <option value="Planting & Sowing">Planting & Sowing</option>
                    <option value="Irrigation">Irrigation</option>
                    <option value="Tillage & Preparation">Tillage & Preparation</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Fuel Type / Power Source</label>
                  <select 
                    className="filter-select"
                    style={{ padding: "0.75rem 1rem" }}
                    value={formFuelType}
                    onChange={(e) => setFormFuelType(e.target.value)}
                  >
                    <option value="Diesel">Diesel</option>
                    <option value="Electric">Electric / Battery</option>
                    <option value="PTO Driven">PTO Driven (Tractor Attach)</option>
                    <option value="Solar">Solar Power</option>
                    <option value="Petrol">Petrol</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Power / Output Rating</label>
                  <input 
                    type="text" 
                    className="form-input" 
                    style={{ paddingLeft: "1rem" }}
                    placeholder="e.g. 50 HP, 30000 mAh"
                    value={formPower}
                    onChange={(e) => setFormPower(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Stock Quantity</label>
                  <input 
                    type="number" 
                    className="form-input" 
                    style={{ paddingLeft: "1rem" }}
                    value={formStock}
                    onChange={(e) => setFormStock(e.target.value)}
                    min={0}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Daily Rental Rate (₹) *</label>
                  <input 
                    type="number" 
                    className="form-input" 
                    style={{ paddingLeft: "1rem" }}
                    value={formRentalRate}
                    onChange={(e) => setFormRentalRate(e.target.value)}
                    min={1}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Purchase Price (₹) *</label>
                  <input 
                    type="number" 
                    className="form-input" 
                    style={{ paddingLeft: "1rem" }}
                    value={formPurchasePrice}
                    onChange={(e) => setFormPurchasePrice(e.target.value)}
                    min={1}
                    required
                  />
                </div>

                <div className="form-group admin-form-full">
                  <label className="form-label">Image URL (Optional)</label>
                  <input 
                    type="text" 
                    className="form-input" 
                    style={{ paddingLeft: "1rem" }}
                    placeholder="e.g., /images/tractor.jpg"
                    value={formImageUrl}
                    onChange={(e) => setFormImageUrl(e.target.value)}
                  />
                </div>

                <div className="form-group admin-form-full">
                  <label className="form-label">Description *</label>
                  <textarea 
                    className="form-input" 
                    style={{ paddingLeft: "1rem", minHeight: "80px", fontFamily: "inherit" }}
                    placeholder="Write details about the machine operation..."
                    value={formDescription}
                    onChange={(e) => setFormDescription(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group admin-form-full">
                  <label className="form-label">Technical Specifications (Format: Key: Value, line separated) *</label>
                  <textarea 
                    className="form-input" 
                    style={{ paddingLeft: "1rem", minHeight: "80px", fontFamily: "monospace" }}
                    placeholder="Engine Power: 60 HP&#10;Lifting Capacity: 2000 kg&#10;Weight: 1800 kg"
                    value={formSpecs}
                    onChange={(e) => setFormSpecs(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div style={{ display: "flex", gap: "1rem", justifyContent: "flex-end" }}>
                <button type="button" className="btn-card" style={{ width: "auto" }} onClick={() => setShowItemForm(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn-primary" style={{ width: "auto", padding: "0.6rem 2rem" }}>
                  Save Equipment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
