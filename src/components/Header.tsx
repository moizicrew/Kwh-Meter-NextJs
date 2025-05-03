import { auth } from "@/auth";

import { ClientHeader } from "./ClientHeader";

const SiteHeader = async () => {
  const session = await auth();

  return <ClientHeader session={session} />;
};

export default SiteHeader;
