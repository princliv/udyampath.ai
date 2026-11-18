import "@fortawesome/fontawesome-free/css/all.min.css";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { get, ref } from "firebase/database";
import { lazy, Suspense, useEffect, useState } from "react";
import { BrowserRouter as Router, Navigate, Route, Routes, useLocation, useNavigate } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { auth, database, firestore } from "./firebase/firebase";
import { doc, getDoc } from "firebase/firestore";
import AuthModal from "./pages/AuthModal";
import FounderNoteModal from "./pages/FounderModal";
import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";
import MobileDock from "./components/layout/MobileDock";
import PageTransition from "./components/shared/PageTransition";
import { Skeleton } from "./components/ui";
import "./styles/shell.css";

const ModulePage = lazy(() => import("./components/coursepage/modulePage"));
const PathwayPhaseDetail = lazy(() => import("./components/coursepage/PathwayPhaseDetail"));
const SpecializationDetail = lazy(() => import("./components/coursepage/SpecializationDetail"));
const TestPage = lazy(() => import("./components/coursepage/TestPage"));
const BaseDetails = lazy(() => import("./components/jobpage/baseDetails"));
const BasePage = lazy(() => import("./components/jobpage/basePage"));
const Books = lazy(() => import("./components/notespage/books"));
const FlashCard = lazy(() => import("./components/notespage/FlashCard"));
const Notes = lazy(() => import("./components/notespage/notes"));
const PyqPage = lazy(() => import("./components/notespage/PyqPage"));
const Adaptability = lazy(() => import("./components/toolspage/adaptability"));
const Communication = lazy(() => import("./components/toolspage/communication"));
const GroupDiscussion = lazy(() => import("./components/toolspage/groupDiscussion"));
const HrInterview = lazy(() => import("./components/toolspage/hrInterview"));
const Placement = lazy(() => import("./components/toolspage/placementpaper"));
const PlaceTest = lazy(() => import("./components/toolspage/placeTest"));
const Pd = lazy(() => import("./components/toolspage/projectlist"));
const ProjectModal = lazy(() => import("./components/toolspage/projectModal"));
const TechInterview = lazy(() => import("./components/toolspage/techInterview"));
const TimeManagement = lazy(() => import("./components/toolspage/timemanage"));
const CourseDetail = lazy(() => import("./pages/coursedetail"));
const CoursePage = lazy(() => import("./pages/coursepage"));
const Homepage = lazy(() => import("./pages/homepage"));
const JobPage = lazy(() => import("./pages/jobpage"));
const NotesPage = lazy(() => import("./pages/notespage"));
const Profile = lazy(() => import("./pages/profile"));
const Recruiter = lazy(() => import("./pages/recruiter"));
const ToolsPage = lazy(() => import("./pages/toolspage"));
const ComingSoon = lazy(() => import("./pages/ComingSoon"));
const BadgeVerify = lazy(() => import("./pages/BadgeVerify"));
const SpecializationPage = lazy(() => import("./components/coursepage/SpecializationPage"));
const JobSimulator = lazy(() => import("./components/coursepage/JobSimulator"));
const ResumeCheck = lazy(() => import("./components/jobpage/ResumeCheck"));
const InterCheck = lazy(() => import("./components/jobpage/InterviewCheck"));
const InternApply = lazy(() => import("./components/jobpage/internApply"));
const JobDetail = lazy(() => import("./components/jobpage/jobDetails"));
const NotFound = lazy(() => import("./pages/NotFound"));
const Welcome = lazy(() => import("./pages/Welcome"));

function ProtectedRoute({ user, loading, children }) {
  if (loading) return null;
  return user ? children : <Navigate to="/homepage" replace />;
}

function RecruiterRoute({ user, loading, userType, children }) {
  if (loading) return null;
  const normalizedType = (userType || "").toLowerCase();
  return user && normalizedType === "recruiter" ? children : <Navigate to="/homepage" replace />;
}

function sectionForPath(pathname) {
  if (pathname.startsWith("/course") || pathname.startsWith("/module") || pathname.startsWith("/specialization") || pathname === "/test") return "learn";
  if (pathname.startsWith("/job-simulator")) return "simulator";
  if (
    pathname.startsWith("/job") ||
    pathname.startsWith("/base") ||
    pathname.startsWith("/intern") ||
    pathname.startsWith("/resume") ||
    pathname === "/interview-checklist"
  ) {
    return "jobs";
  }
  if (
    pathname.startsWith("/tool") ||
    ["/techInterview", "/hrInterview", "/groupdiscussion", "/projectModal", "/placementpapers", "/placeTest", "/communication", "/adaptability", "/timemanage", "/Pdetails"].includes(pathname)
  ) {
    return "tools";
  }
  if (pathname.startsWith("/note") || pathname.startsWith("/pyq") || pathname.startsWith("/flash") || pathname.startsWith("/book")) return "notes";
  if (pathname.startsWith("/profile")) return "profile";
  if (pathname.startsWith("/recruiter")) return "recruiter";
  return undefined;
}

function AppContent() {
  const [user, setUser] = useState(null);
  const [userType, setUserType] = useState("");
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState("login");
  const [showModal, setShowModal] = useState(false);

  const founderSeenKey = user?.uid ? `udyampath-founder-seen:${user.uid}` : "udyampath-founder-seen:guest";
  const isAuthPage = location.pathname === "/login" || location.pathname === "/signup";
  const showDock = !isAuthPage && location.pathname !== "/recruiter";

  useEffect(() => {
    if (isAuthLoading) return undefined;
    let alreadySeen = false;
    try {
      alreadySeen = localStorage.getItem(founderSeenKey) === "1";
    } catch {
      alreadySeen = false;
    }
    if (alreadySeen) return undefined;
    const timer = setTimeout(() => setShowModal(true), 20000);
    return () => clearTimeout(timer);
  }, [founderSeenKey, isAuthLoading]);

  useEffect(() => {
    if (!user || isAuthLoading) return undefined;
    let cancelled = false;
    getDoc(doc(firestore, "users", user.uid))
      .then((snap) => {
        if (cancelled || !snap.exists()) return;
        const data = snap.data();
        if (data.recruiterRequested || data.onboarding?.completed) return;
        if (location.pathname === "/welcome") return;
        navigate("/welcome", { replace: true });
      })
      .catch((error) => console.error("Could not read onboarding:", error));
    return () => {
      cancelled = true;
    };
  }, [user, isAuthLoading, location.pathname, navigate]);

  useEffect(() => {
    if (location.pathname === "/login") {
      setAuthMode("login");
      setIsModalOpen(true);
    }
    if (location.pathname === "/signup") {
      setAuthMode("signup");
      setIsModalOpen(true);
    }
  }, [location.pathname]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (!currentUser) {
        setUserType("");
        setIsAuthLoading(false);
        return;
      }
      try {
        const snapshot = await get(ref(database, `users/${currentUser.uid}`));
        const profile = snapshot.exists() ? snapshot.val() : null;
        setUserType(profile?.userType || "");
      } catch (error) {
        console.error("Failed to read user profile:", error);
        setUserType("");
      } finally {
        setIsAuthLoading(false);
      }
    });
    return () => unsubscribe();
  }, []);

  const handleLogout = () => {
    signOut(auth)
      .then(() => setUser(null))
      .catch((error) => console.error("Logout error:", error));
  };

  const closeAuthModal = (result) => {
    setIsModalOpen(false);
    if (result?.redirected) return;
    if (isAuthPage) navigate("/homepage", { replace: true });
  };

  const handleCloseFounder = () => {
    try {
      localStorage.setItem(founderSeenKey, "1");
    } catch (error) {
      console.error("Could not remember founder note:", error);
    }
    setShowModal(false);
  };

  return (
    <>
      <Header user={user} onLogin={(mode) => { setAuthMode(mode); setIsModalOpen(true); }} onLogout={handleLogout} />
      <main className={showDock ? "has-dock" : undefined} data-section={sectionForPath(location.pathname)}>
        <AnimatePresence mode="wait">
          <PageTransition key={location.pathname}>
            <Suspense fallback={<div className="route-fallback"><Skeleton className="h-8 w-48" /></div>}>
              <Routes location={location}>
                <Route path="/" element={<Homepage />} />
                <Route path="/homepage" element={<Homepage />} />
                <Route path="/welcome" element={<Welcome />} />
                <Route path="/coursepage" element={<CoursePage />} />
                <Route path="/jobpage" element={<JobPage />} />
                <Route path="/toolspage" element={<ToolsPage />} />
                <Route path="/profile" element={<ProtectedRoute user={user} loading={isAuthLoading}><Profile /></ProtectedRoute>} />
                <Route path="/notespage" element={<NotesPage />} />
                <Route path="/coursedetail" element={<CourseDetail />} />
                <Route path="/base" element={<BasePage />} />
                <Route path="/basedetails" element={<BaseDetails />} />
                <Route path="/techInterview" element={<TechInterview />} />
                <Route path="/hrInterview" element={<HrInterview />} />
                <Route path="/groupdiscussion" element={<GroupDiscussion />} />
                <Route path="/projectModal" element={<ProjectModal />} />
                <Route path="/notes" element={<Notes />} />
                <Route path="/placementpapers" element={<Placement />} />
                <Route path="/placeTest" element={<PlaceTest />} />
                <Route path="/books" element={<Books />} />
                <Route path="/login" element={<div style={{ minHeight: "100vh" }} />} />
                <Route path="/signup" element={<div style={{ minHeight: "100vh" }} />} />
                <Route path="/recruiter" element={<RecruiterRoute user={user} loading={isAuthLoading} userType={userType}><Recruiter /></RecruiterRoute>} />
                <Route path="/communication" element={<Communication />} />
                <Route path="/adaptability" element={<Adaptability />} />
                <Route path="/timemanage" element={<TimeManagement />} />
                <Route path="/module" element={<ModulePage />} />
                <Route path="/test" element={<TestPage />} />
                <Route path="/pyqs" element={<PyqPage />} />
                <Route path="/flashcards" element={<FlashCard />} />
                <Route path="/specialization/:id" element={<SpecializationDetail />} />
                <Route path="/specialization/:id/pathway/:phaseIndex" element={<PathwayPhaseDetail />} />
                <Route path="/Pdetails" element={<Pd />} />
                <Route path="/intern-apply" element={<InternApply />} />
                <Route path="/jobDetails" element={<JobDetail />} />
                <Route path="/job-simulator" element={<JobSimulator />} />
                <Route path="/verify/badge/:id" element={<BadgeVerify />} />
                <Route path="/specializations" element={<SpecializationPage />} />
                <Route path="/ai-mentor" element={<ComingSoon title="AI Mentor" />} />
                <Route path="/resume-check" element={<ResumeCheck />} />
                <Route path="/interview-checklist" element={<InterCheck />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
          </PageTransition>
        </AnimatePresence>
      </main>
      <MobileDock user={user} onLogin={(mode) => { setAuthMode(mode); setIsModalOpen(true); }} onLogout={handleLogout} />
      <AuthModal isOpen={isModalOpen} onClose={closeAuthModal} initialMode={authMode} />
      {showModal ? <FounderNoteModal onClose={handleCloseFounder} /> : null}
      <Footer />
    </>
  );
}

export default function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}
