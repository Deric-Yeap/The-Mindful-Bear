export const getCombinedUserAvatars = (
  userAvatars,
  avatarList,
  userFragments
) => {
  const userOwnedAvatarIds = userAvatars.map(
    (userAvatar) => userAvatar.avatar.avatar_id
  )

  const filteredAvatars = avatarList.filter(
    (avatar) => !userOwnedAvatarIds.includes(avatar.avatar_id)
  )

  const updatedFilteredAvatars = filteredAvatars.map((avatar) => {
    const matchingFragment = userFragments.find(
      (fragment) => fragment.avatar.avatar_id === avatar.avatar_id
    )

    return {
      ...avatar,
      current_quantity: matchingFragment ? matchingFragment.quantity : 0,
      fragment_id: matchingFragment ? matchingFragment.id : 0,
    }
  })

  return updatedFilteredAvatars
}
