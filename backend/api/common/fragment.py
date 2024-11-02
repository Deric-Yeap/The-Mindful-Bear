import random

def gachaFragment(avatarList):
    total_probabilities = []
    total_sum = 0.0

    for avatar in avatarList:
        total_sum += float(avatar.drop_rate)
        total_probabilities.append((avatar, total_sum))

    rng = random.random()
    for avatar, total_probability in total_probabilities:
        if rng <= total_probability:
            return avatar
        
    return None
