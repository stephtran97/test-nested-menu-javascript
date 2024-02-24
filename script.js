"use script";

const SUB_MENU_LEVELS = [0, 1, 2, 3];

const body = document.querySelector("body");
const header = document.querySelector("header");
const backdrop = document.querySelector(".backdrop");
const subMenuHeadings = document.querySelectorAll(".submenu-heading");
const subMenuItems = document.querySelectorAll(".submenu-items");
const navItems = document.querySelectorAll(".nav-item");

const addBackdrop = () => {
  backdrop.classList.remove("none");
  body.classList.add("relative");
  backdrop.classList.add("absolute");
  backdrop.style.zIndex = "50";
  backdrop.style.top = "0";
  backdrop.style.top = "0";
  header.style.zIndex = "100";
};

const removeBackdrop = () => {
  backdrop.classList.add("none");
  body.classList.remove("relative");
  backdrop.classList.remove("absolute");
  backdrop.style.zIndex = "1";
  header.style.zIndex = "1";
};

// clear active
const removeActiveAll = () => {
  navItems.forEach((navItem) => {
    const isActive = navItem.classList.contains("active");
    if (isActive) {
      navItem.classList.remove("active");
    }
  });
};

const removeActiveAtLevel = (menuLevel) => {
  navItems.forEach((navItem) => {
    const isActive = navItem.classList.contains("active");
    const isAtMenuLevel = navItem.dataset.subMenuLevel === menuLevel;
    if (isActive && isAtMenuLevel) {
      navItem.classList.remove("active");
    }
  });
  if (menuLevel === (SUB_MENU_LEVELS.length - 1).toString()) return;
  return removeActiveAtLevel((Number(menuLevel) + 1).toString());
};

// clear display
const removeDisplayAll = () => {
  subMenuItems.forEach((subMenuItem) => {
    const isDisplay = !subMenuItem.classList.contains("none");
    const haveRelative = subMenuItem.parentNode.classList.contains("relative");
    const haveAbsolute = subMenuItem.classList.contains("absolute");
    isDisplay && subMenuItem.classList.add("none");
    haveRelative && subMenuItem.parentNode.classList.remove("relative");
    haveAbsolute && subMenuItem.classList.remove("absolute");
  });
};

const removeDisplayAtLevel = (menuLevel) => {
  subMenuItems.forEach((subMenuItem) => {
    const currentLevel =
      subMenuItem.previousElementSibling.dataset.subMenuLevel;
    const isAtMenuLevel = currentLevel === menuLevel;
    const isDisplay = !subMenuItem.classList.contains("none");
    const haveRelative = subMenuItem.parentNode.classList.contains("relative");
    const haveAbsolute = subMenuItem.classList.contains("absolute");
    if (isAtMenuLevel) {
      isDisplay && subMenuItem.classList.add("none");
      haveRelative && subMenuItem.parentNode.classList.remove("relative");
      haveAbsolute && subMenuItem.classList.remove("absolute");
    }
  });
  if (menuLevel === (SUB_MENU_LEVELS.length - 1).toString()) return;
  return removeDisplayAtLevel((Number(menuLevel) + 1).toString());
};

const resetMenuDisplay = () => {
  removeActiveAll();
  removeDisplayAll();
  removeBackdrop();
};
// Event Listener

navItems.forEach((navItem) => {
  navItem.addEventListener("click", (e) => {
    e.preventDefault();
    addBackdrop();
    const isActive = navItem.classList.contains("active");
    const currentLevel = navItem.dataset.subMenuLevel;
    if (isActive) {
      navItem.classList.remove("active");
    } else {
      removeActiveAtLevel(currentLevel);
      removeDisplayAtLevel(currentLevel);
      navItem.classList.add("active");
    }
    if (e.target.classList.contains("submenu-heading")) {
      e.target.parentNode.classList.toggle("relative");
      if (e.target.nextElementSibling) {
        e.target.nextElementSibling.classList.toggle("none");
        e.target.nextElementSibling.classList.toggle("absolute");
      }
    }
  });
});

subMenuHeadings.forEach((subMenuHeading) => {
  subMenuHeading.addEventListener("click", (e) => {
    e.preventDefault();
    if (!e.target.nextElementSibling) {
      return;
    }
    if (e.target.dataset.subMenuLevel !== "0") {
      e.target.nextElementSibling.classList.add("level-1-position");
    }
  });
});

backdrop.addEventListener("click", (e) => {
  e.preventDefault();
  resetMenuDisplay();
});

header.addEventListener("click", (e) => {
  e.preventDefault();
  if (!e.target.classList.contains("nav-item")) {
    resetMenuDisplay();
  }
});
