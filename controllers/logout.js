const logout = (req, res) => {
    try {
        // Clear authentication cookies
        res.clearCookie("token", { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "Strict" });
        res.clearCookie("role", { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "Strict" });

        return res.status(200).json({ success: "User logged out successfully" });
    } catch (error) {
        console.error("Logout error:", error.message);
        return res.status(500).json({ error: "Internal Server Error" });
    }
};

module.exports = { logout };
