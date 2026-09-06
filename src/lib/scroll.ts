export function scrollToPlanner(id: string = "planner") {
  const el = document.getElementById(id);
  if (!el) return;
  window.scrollTo({
    top: el.getBoundingClientRect().top + window.scrollY - 66,
    behavior: "smooth",
  });
}
