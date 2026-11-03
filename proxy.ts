import { withAuth } from "next-auth/middleware";

export default withAuth(function proxy() {});

export const config = {
  matcher: ["/admin/dashboard/:path*"],
};
