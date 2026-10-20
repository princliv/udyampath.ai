import React, { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  animate,
  motion,
  useInView,
  useMotionValue,
  useReducedMotion,
  useTransform,
} from "framer-motion";
import { useMediaQuery } from "react-responsive";
import { ArrowRight, ChevronLeft, ChevronRight, Clock, Pause, Play } from "lucide-react";
import homeArrow from "../../assets/homearrow.png";
import homePopular from "../../assets/homepopular.png";

const courseData = [
  {
    title: "UI/UX Design",
    description: "Learn user research, wireframing, and modern interaction patterns.",
    link: "/coursepage",
    level: "Beginner",
    duration: "6 Weeks",
    accent: "#a5b4fc",
  },
  {
    title: "Full Stack Development",
    description: "Build real-world apps with frontend, backend, APIs, and deployment.",
    link: "/coursepage",
    level: "Intermediate",
    duration: "10 Weeks",
    accent: "#7dd3fc",
  },
  {
    title: "Data Science",
    description: "Master Python, analytics, machine learning, and data storytelling.",
    link: "/coursepage",
    level: "Intermediate",
    duration: "8 Weeks",
    accent: "#6ee7b7",
  },
  {
    title: "Cybersecurity Essentials",
    description: "Understand threats, secure systems, and protect modern applications.",
    link: "/coursepage",
    level: "Beginner",
    duration: "7 Weeks",
    accent: "#fca5a5",
  },
  {
    title: "Digital Marketing",
    description: "Run SEO, social, and paid campaigns with measurable growth.",
    link: "/coursepage",
    level: "All Levels",
    duration: "5 Weeks",
    accent: "#fcd34d",
  },
  {
    title: "Cloud Computing",
    description: "Deploy scalable services using AWS, Azure, and cloud architecture.",
    link: "/coursepage",
    level: "Advanced",
    duration: "9 Weeks",
    accent: "#93c5fd",
  },
];

const AUTOPLAY_MS = 4000;
const SLIDE_SPRING = { type: "spring", stiffness: 260, damping: 32, mass: 0.9 };
// Reduced motion (also on when Windows "Animation effects" is off): still slides, but short and without bounce.
const SLIDE_CALM = { type: "tween", duration: 0.3, ease: "easeOut" };

// One card in the track. Cards scale down and fade as they slide out of view,
// so swiping (auto or manual) feels like the deck is moving, not just shifting.
const Slide = ({ course, rank, slideIndex, trackX, slideWidth, fullVisible, perView, hidden, reduceMotion }) => {
  const distance = useTransform(trackX, (latest) => {
    if (!slideWidth) return 0;
    const offset = slideIndex + latest / slideWidth;
    if (offset < 0) return Math.min(-offset, 1);
    if (offset > fullVisible - 1) return Math.min(offset - (fullVisible - 1), 1);
    return 0;
  });
  const scale = useTransform(distance, [0, 1], [1, reduceMotion ? 1 : 0.9]);
  const opacity = useTransform(distance, [0, 1], [1, 0.45]);

  return (
    <div
      role="group"
      aria-roledescription="slide"
      aria-label={`${rank} of ${courseData.length}: ${course.title}`}
      aria-hidden={hidden}
      style={{ ...styles.slide, width: `${100 / perView}%` }}
    >
      <motion.article
        style={{ ...styles.card, scale, opacity }}
        whileHover={reduceMotion ? undefined : { y: -6 }}
        transition={{ type: "spring", stiffness: 300, damping: 22 }}
      >
        <div style={{ ...styles.accentStrip, background: course.accent }} />
        <div style={styles.imageWrap}>
          <img src={homePopular} alt="" draggable={false} style={styles.cardImage} />
          <div
            style={{
              ...styles.imageOverlay,
              background: `linear-gradient(160deg, ${course.accent}55 0%, rgba(15, 23, 42, 0.05) 45%, rgba(15, 23, 42, 0.55) 100%)`,
            }}
          />
          <span style={styles.levelChip}>{course.level}</span>
          <span style={styles.rankChip}>#{rank} popular</span>
        </div>

        <div style={styles.content}>
          <div>
            <h3 style={styles.cardTitle}>{course.title}</h3>
            <p style={styles.cardDesc}>{course.description}</p>
          </div>

          <div style={styles.footerRow}>
            <span style={styles.duration}>
              <Clock size={16} strokeWidth={1.75} aria-hidden="true" />
              {course.duration}
            </span>
            <Link
              to={course.link}
              style={styles.cardButton}
              tabIndex={hidden ? -1 : 0}
              draggable={false}
            >
              Start learning
              <ArrowRight size={16} strokeWidth={2} aria-hidden="true" />
            </Link>
          </div>
        </div>
      </motion.article>
    </div>
  );
};

const Popular = () => {
  const isMobile = useMediaQuery({ maxWidth: 768 });
  const isTablet = useMediaQuery({ minWidth: 769, maxWidth: 1100 });
  const reduceMotion = useReducedMotion();

  // Mobile shows 1 card plus a peek of the next one, as a hint that it swipes.
  const perView = isMobile ? 1.15 : isTablet ? 2 : 3;
  const fullVisible = Math.floor(perView);
  const total = courseData.length;

  // Three copies of the list let the track loop forever: we always stay inside
  // the middle copy and silently jump by one copy when we drift out of it.
  const slides = useMemo(() => [...courseData, ...courseData, ...courseData], []);

  const shellRef = useRef(null);
  const viewportRef = useRef(null);
  const positionRef = useRef(total);
  const animationRef = useRef(null);
  const dragMoved = useRef(false);

  const x = useMotionValue(0);
  const [slideWidth, setSlideWidth] = useState(0);
  const [position, setPosition] = useState(total);
  const [isHovered, setIsHovered] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [userPaused, setUserPaused] = useState(false);
  const [pageVisible, setPageVisible] = useState(true);
  const inView = useInView(shellRef, { amount: 0.4 });

  useLayoutEffect(() => {
    const viewport = viewportRef.current;
    if (!viewport) return undefined;
    const measure = () => {
      const width = viewport.clientWidth / perView;
      animationRef.current?.stop();
      setSlideWidth(width);
      x.set(-positionRef.current * width);
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(viewport);
    return () => observer.disconnect();
  }, [perView, x]);

  useEffect(() => {
    const onVisibility = () => setPageVisible(!document.hidden);
    document.addEventListener("visibilitychange", onVisibility);
    return () => document.removeEventListener("visibilitychange", onVisibility);
  }, []);

  const slideBy = useCallback(
    (delta) => {
      if (!slideWidth || delta === 0) return;
      let current = positionRef.current;
      let target = current + delta;

      // Re-centre into the middle copy first; the copies are identical, so the jump is invisible.
      if (target >= total * 2 || target < total) {
        const shift = target >= total * 2 ? -total : total;
        current += shift;
        target += shift;
        x.set(x.get() - shift * slideWidth);
      }

      positionRef.current = target;
      setPosition(target);
      animationRef.current?.stop();
      animationRef.current = animate(x, -target * slideWidth, reduceMotion ? SLIDE_CALM : SLIDE_SPRING);
    },
    [slideWidth, total, x, reduceMotion]
  );

  const goTo = (courseIndex) => slideBy(total + courseIndex - positionRef.current);

  const paused = isHovered || isFocused || isDragging || userPaused || !inView || !pageVisible;

  useEffect(() => {
    if (paused || !slideWidth) return undefined;
    const timer = setTimeout(() => slideBy(1), AUTOPLAY_MS);
    return () => clearTimeout(timer);
  }, [paused, position, slideWidth, slideBy]);

  const handleDragStart = () => {
    animationRef.current?.stop();
    dragMoved.current = false;
    setIsDragging(true);
  };

  const handleDrag = (_, info) => {
    if (Math.abs(info.offset.x) > 6) dragMoved.current = true;
  };

  const handleDragEnd = (_, info) => {
    setIsDragging(false);
    if (!slideWidth) return;
    // Where the track would land with a little momentum, snapped to the nearest card.
    const projected = -(x.get() + info.velocity.x * 0.2) / slideWidth;
    let delta = Math.round(projected) - positionRef.current;
    if (delta === 0 && Math.abs(info.offset.x) > slideWidth * 0.15) {
      delta = info.offset.x < 0 ? 1 : -1;
    }
    delta = Math.max(-fullVisible, Math.min(fullVisible, delta));
    if (delta === 0) {
      animationRef.current = animate(
        x,
        -positionRef.current * slideWidth,
        reduceMotion ? SLIDE_CALM : SLIDE_SPRING
      );
    } else {
      slideBy(delta);
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === "ArrowRight") {
      event.preventDefault();
      slideBy(1);
    } else if (event.key === "ArrowLeft") {
      event.preventDefault();
      slideBy(-1);
    }
  };

  const activeCourse = ((position % total) + total) % total;

  return (
    <section
      style={styles.section}
      aria-roledescription="carousel"
      aria-label="Most popular courses"
    >
      <div style={{ ...styles.headerBlock, ...(isMobile ? styles.headerBlockMobile : null) }}>
        <motion.div
          initial={{ opacity: 0, y: 22 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.55, ease: "easeOut" }}
        >
          <h2 style={styles.heading}>
            Most Popular Courses
            <img src={homeArrow} alt="" style={styles.arrowIcon} />
          </h2>
          <p style={styles.subHeading}>
            Curated programs learners keep coming back to. Explore practical,
            career-ready courses designed to help you level up faster.
          </p>
        </motion.div>

        {!isMobile && (
          <div style={styles.navGroup}>
            <motion.button
              type="button"
              aria-label="Previous course"
              style={styles.navButton}
              onClick={() => slideBy(-1)}
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.92 }}
            >
              <ChevronLeft size={22} strokeWidth={2} aria-hidden="true" />
            </motion.button>
            <motion.button
              type="button"
              aria-label="Next course"
              style={styles.navButton}
              onClick={() => slideBy(1)}
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.92 }}
            >
              <ChevronRight size={22} strokeWidth={2} aria-hidden="true" />
            </motion.button>
          </div>
        )}
      </div>

      <div
        ref={shellRef}
        style={{ ...styles.carouselShell, ...(isMobile ? styles.carouselShellMobile : null) }}
        onPointerEnter={(event) => event.pointerType === "mouse" && setIsHovered(true)}
        onPointerLeave={(event) => event.pointerType === "mouse" && setIsHovered(false)}
        onFocus={(event) => {
          // Only keyboard focus pauses; a mouse click or tap on a dot shouldn't stop autoplay.
          if (event.target.matches?.(":focus-visible")) setIsFocused(true);
        }}
        onBlur={(event) => {
          if (!event.currentTarget.contains(event.relatedTarget)) setIsFocused(false);
        }}
        onKeyDown={handleKeyDown}
      >
        <div ref={viewportRef} style={styles.viewport}>
          <motion.div
            style={{ ...styles.track, x, cursor: isDragging ? "grabbing" : "grab" }}
            drag="x"
            dragMomentum={false}
            onDragStart={handleDragStart}
            onDrag={handleDrag}
            onDragEnd={handleDragEnd}
            onClickCapture={(event) => {
              // A swipe that ends on a card shouldn't also open the course.
              if (dragMoved.current) {
                event.preventDefault();
                event.stopPropagation();
                dragMoved.current = false;
              }
            }}
          >
            {slides.map((course, index) => (
              <Slide
                key={`${course.title}-${index}`}
                course={course}
                rank={(index % total) + 1}
                slideIndex={index}
                trackX={x}
                slideWidth={slideWidth}
                fullVisible={fullVisible}
                perView={perView}
                reduceMotion={reduceMotion}
                hidden={index < position || index >= position + fullVisible}
              />
            ))}
          </motion.div>
        </div>

        <div style={styles.controlsRow}>
          <div style={styles.dots} role="group" aria-label="Choose a course">
            {courseData.map((course, index) => {
              const isActive = index === activeCourse;
              return (
                <button
                  key={course.title}
                  type="button"
                  aria-label={`Show ${course.title}`}
                  aria-current={isActive ? "true" : undefined}
                  onClick={() => goTo(index)}
                  style={styles.dotButton}
                >
                  <motion.span
                    style={styles.dotTrack}
                    animate={{ width: isActive ? 36 : 10 }}
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  >
                    {isActive && (
                      <motion.span
                        key={`${position}-${paused}`}
                        style={styles.dotFill}
                        initial={{ scaleX: paused ? 1 : 0 }}
                        animate={{ scaleX: 1 }}
                        transition={{ duration: paused ? 0 : AUTOPLAY_MS / 1000, ease: "linear" }}
                      />
                    )}
                  </motion.span>
                </button>
              );
            })}
          </div>

          <button
            type="button"
            style={styles.pauseButton}
            onClick={() => setUserPaused((prev) => !prev)}
            aria-label={userPaused ? "Resume auto-scroll" : "Pause auto-scroll"}
            aria-pressed={userPaused}
          >
            {userPaused ? (
              <Play size={16} strokeWidth={2} aria-hidden="true" />
            ) : (
              <Pause size={16} strokeWidth={2} aria-hidden="true" />
            )}
          </button>
        </div>
      </div>
    </section>
  );
};

const styles = {
  section: {
    width: "100%",
    padding: "64px 0 48px",
    background: "linear-gradient(to right, #4b2b7f, #003057)",
    color: "#ffffff",
    overflow: "hidden",
  },
  headerBlock: {
    width: "100%",
    maxWidth: "1240px",
    margin: "0 auto 32px",
    padding: "0 24px",
    boxSizing: "border-box",
    display: "flex",
    alignItems: "flex-end",
    justifyContent: "space-between",
    gap: "24px",
  },
  headerBlockMobile: {
    padding: "0 16px",
    marginBottom: "24px",
  },
  heading: {
    margin: 0,
    fontSize: "var(--fs-display)",
    fontWeight: 600,
    letterSpacing: "-0.025em",
    lineHeight: 1.15,
    display: "inline-flex",
    alignItems: "center",
    gap: "10px",
  },
  arrowIcon: {
    width: "36px",
    height: "36px",
    objectFit: "contain",
  },
  subHeading: {
    margin: "14px 0 0",
    fontSize: "1rem",
    color: "rgba(236, 244, 255, 0.9)",
    maxWidth: "700px",
    lineHeight: 1.7,
  },
  navGroup: {
    display: "flex",
    gap: "12px",
    flexShrink: 0,
  },
  navButton: {
    width: "48px",
    height: "48px",
    borderRadius: "50%",
    border: "1px solid rgba(255, 255, 255, 0.3)",
    background: "rgba(255, 255, 255, 0.12)",
    backdropFilter: "blur(12px)",
    WebkitBackdropFilter: "blur(12px)",
    color: "#ffffff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
  },
  carouselShell: {
    width: "100%",
    maxWidth: "1240px",
    margin: "0 auto",
    padding: "0 12px",
    boxSizing: "border-box",
  },
  carouselShellMobile: {
    padding: "0 8px",
  },
  viewport: {
    width: "100%",
    overflow: "hidden",
    padding: "12px 0 40px",
  },
  track: {
    display: "flex",
    width: "100%",
    alignItems: "stretch",
    touchAction: "pan-y",
    userSelect: "none",
    willChange: "transform",
  },
  slide: {
    flexShrink: 0,
    boxSizing: "border-box",
    padding: "0 12px",
  },
  card: {
    height: "100%",
    position: "relative",
    borderRadius: "20px",
    overflow: "hidden",
    background: "#ffffff",
    color: "#0f172a",
    boxShadow: "0 16px 40px rgba(2, 8, 23, 0.32)",
    display: "flex",
    flexDirection: "column",
  },
  accentStrip: {
    height: "5px",
    width: "100%",
  },
  imageWrap: {
    position: "relative",
    height: "164px",
    overflow: "hidden",
  },
  cardImage: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    pointerEvents: "none",
  },
  imageOverlay: {
    position: "absolute",
    inset: 0,
  },
  levelChip: {
    position: "absolute",
    top: "12px",
    left: "12px",
    padding: "6px 12px",
    borderRadius: "999px",
    background: "rgba(255, 255, 255, 0.92)",
    color: "#0f172a",
    fontSize: "0.75rem",
    fontWeight: 600,
  },
  rankChip: {
    position: "absolute",
    bottom: "12px",
    right: "12px",
    padding: "5px 10px",
    borderRadius: "999px",
    background: "rgba(15, 23, 42, 0.7)",
    color: "#ffffff",
    fontSize: "0.75rem",
    fontWeight: 700,
  },
  content: {
    padding: "18px 20px 20px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    gap: "16px",
    flex: 1,
  },
  cardTitle: {
    margin: 0,
    fontSize: "1.15rem",
    fontWeight: 700,
    lineHeight: 1.35,
    color: "#0f172a",
  },
  cardDesc: {
    margin: "8px 0 0",
    fontSize: "0.92rem",
    lineHeight: 1.55,
    color: "#475569",
    display: "-webkit-box",
    WebkitLineClamp: 2,
    WebkitBoxOrient: "vertical",
    overflow: "hidden",
  },
  footerRow: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "10px",
    paddingTop: "14px",
    borderTop: "1px solid #e2e8f0",
  },
  duration: {
    display: "inline-flex",
    alignItems: "center",
    gap: "6px",
    fontSize: "0.85rem",
    fontWeight: 500,
    color: "#475569",
  },
  cardButton: {
    display: "inline-flex",
    alignItems: "center",
    gap: "6px",
    textDecoration: "none",
    padding: "10px 16px",
    minHeight: "44px",
    boxSizing: "border-box",
    borderRadius: "10px",
    background: "#0b6aa6",
    color: "#ffffff",
    fontSize: "0.88rem",
    fontWeight: 700,
    whiteSpace: "nowrap",
  },
  controlsRow: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "16px",
    marginTop: "-12px",
  },
  dots: {
    display: "flex",
    alignItems: "center",
    gap: "2px",
  },
  dotButton: {
    border: "none",
    background: "transparent",
    padding: "17px 4px",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
  },
  dotTrack: {
    display: "block",
    height: "10px",
    borderRadius: "999px",
    background: "rgba(255, 255, 255, 0.3)",
    overflow: "hidden",
  },
  dotFill: {
    display: "block",
    height: "100%",
    width: "100%",
    background: "#ffffff",
    borderRadius: "999px",
    transformOrigin: "left center",
  },
  pauseButton: {
    width: "44px",
    height: "44px",
    borderRadius: "50%",
    border: "1px solid rgba(255, 255, 255, 0.3)",
    background: "rgba(255, 255, 255, 0.1)",
    color: "#ffffff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
  },
};

export default Popular;
