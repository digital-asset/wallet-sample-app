import { User } from "@daml.js/user";
import { useAdminParty } from "@daml/hub-react";
import { publicContext } from "../App";

export const useCustomAdminParty = (): string => {

  const damlHubAdminPartyId = useAdminParty();
  const aliases = publicContext.useStreamQueries(User.Alias, () => [], []);
  const [adminString] = aliases?.contracts?.filter(
    (contract) => contract?.payload?.alias === "Admin"
  );
  const localAdminPartyId = adminString?.payload?.username;
  const admin = damlHubAdminPartyId || localAdminPartyId;
  return admin;
};
