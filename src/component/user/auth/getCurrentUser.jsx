export const getCurrentUser = () => {
  try {
    const localUser = localStorage.getItem('user');
    const sessionUser = sessionStorage.getItem('user');
    
    return localUser 
      ? JSON.parse(localUser)
      : sessionUser
        ? JSON.parse(sessionUser)
        : null;
  } catch (error) {
    console.error("Error parsing user data:", error);
    return null;
  }
};