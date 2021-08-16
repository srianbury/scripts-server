import { ForbiddenError } from "apollo-server-express";

function isOwnerWrapper(requestor) {
  return (asset) => isOwner(asset, requestor);
}

function isOwner(asset, requestor) {
  if (isGodAdmin(requestor)) {
    return;
  }

  if (asset.userId !== requestor.id) {
    throw new ForbiddenError(
      "Permission denined.  User does not own the object to update."
    );
  }
}

function isGodAdmin(requestor) {
  return requestor && requestor.roles && requestor.roles.includes("GOD");
}

export { isOwnerWrapper };
