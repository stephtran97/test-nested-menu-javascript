"use script";

const SUB_MENU_LEVELS = [0, 1, 2, 3];

const body = document.querySelector("body");
const header = document.querySelector("header");
const backdrop = document.querySelector(".backdrop");
const subMenuItems = document.querySelectorAll(".submenu-items");
const navItems = document.querySelectorAll(".nav-item");

// ************** Menu state management **************
const initialMenusState = new Array(SUB_MENU_LEVELS.length);

let currentMenusState = localStorage.getItem("CURRENT_MENUS_STATE")
  ? JSON.parse(localStorage.getItem("CURRENT_MENUS_STATE"))
  : initialMenusState;

const setCurrentMenusState = (state) => {
  currentMenusState = state;
  localStorage.setItem(
    "CURRENT_MENUS_STATE",
    JSON.stringify(currentMenusState),
  );
};

const saveMenuState = (navItem) => {
  const index = Number(navItem.dataset.subMenuLevel);
  currentMenusState[index] = navItem.dataset.subMenuKey;
  setCurrentMenusState(currentMenusState);
};

const resetStateAtLevel = (menuLevel) => {
  const index = Number(menuLevel);
  for (let i = index + 1; i < currentMenusState.length; i++) {
    currentMenusState[i] = null;
  }
  setCurrentMenusState(currentMenusState);
};

const resetStateAll = () => {
  setCurrentMenusState(initialMenusState);
};

const setActiveNavItem = (navItem) => {
  saveMenuState(navItem);
  const isActive = navItem.classList.contains("active");
  const currentLevel = navItem.dataset.subMenuLevel;
  if (isActive) {
    navItem.classList.remove("active");
  } else {
    removeActiveAtLevel(currentLevel);
    removeDisplayAtLevel(currentLevel);
    navItem.classList.add("active");
  }
  resetStateAtLevel(currentLevel);
  if (navItem.classList.contains("submenu-heading")) {
    navItem.parentNode.classList.toggle("relative");
    if (navItem.nextElementSibling) {
      navItem.nextElementSibling.classList.toggle("none");
      navItem.nextElementSibling.classList.toggle("absolute");
      if (navItem.dataset.subMenuLevel !== "0") {
        navItem.nextElementSibling.classList.add("level-1-position");
      }
    }
  }
};

// ************** Display management **************

const addBackdrop = () => {
  backdrop.classList.remove("none");
  body.classList.add("relative");
  backdrop.classList.add("absolute");
  backdrop.style.zIndex = "50";
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
  setCurrentMenusState(initialMenusState);
  removeActiveAll();
  removeDisplayAll();
  removeBackdrop();
};

const init = () => {
  if (currentMenusState[0]) {
    addBackdrop();
  }
  navItems.forEach((navItem) => {
    if (
      navItem.dataset.subMenuLevel === "0" &&
      navItem.dataset.subMenuKey ===
        currentMenusState[Number(navItem.dataset.subMenuLevel)]
    ) {
      navItem.classList.add("active");
      navItem.parentNode.classList.toggle("relative");
      if (navItem.nextElementSibling) {
        navItem.nextElementSibling.classList.toggle("none");
        navItem.nextElementSibling.classList.toggle("absolute");
      }
      return;
    }
    if (
      navItem.dataset.subMenuLevel ===
        (currentMenusState.length - 1).toString() &&
      navItem.dataset.subMenuKey === currentMenusState[-1]
    ) {
      navItem.classList.add("active");
      return;
    }
    if (
      navItem.dataset.subMenuKey ===
      currentMenusState[Number(navItem.dataset.subMenuLevel)]
    ) {
      navItem.classList.add("active");
      navItem.parentNode.classList.toggle("relative");
      if (navItem.nextElementSibling) {
        navItem.nextElementSibling.classList.toggle("none");
        navItem.nextElementSibling.classList.toggle("absolute");
        navItem.nextElementSibling.classList.add("level-1-position");
      }
    }
  });
};

// ************** Run **************

init();

navItems.forEach((navItem) => {
  navItem.addEventListener("click", (e) => {
    e.preventDefault();
    addBackdrop();
    setActiveNavItem(navItem);
  });
});

backdrop.addEventListener("click", (e) => {
  e.preventDefault();
  resetMenuDisplay();
  resetStateAll();
});

header.addEventListener("click", (e) => {
  e.preventDefault();
  if (!e.target.classList.contains("nav-item")) {
    resetMenuDisplay();
    resetStateAll();
  }
});
