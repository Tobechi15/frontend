export function logout(setIsAuthenticated: (value: boolean) => void) {
    sessionStorage.removeItem("isAuthenticated");
    setIsAuthenticated(false);
}
