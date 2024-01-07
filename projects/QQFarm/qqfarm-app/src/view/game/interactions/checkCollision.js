
// ----- Collision detection -----
export function checkCollision(other, player, pressed) {
    if (player.sprite.getBounds().intersects(other.sprite.getBounds())){
        if(pressed.left)
        {
            if(player.sprite.x > other.sprite.x + other.sprite.width - player.sprite.width/2)
            {
                player.velocity.x = 0;
            }
        }
        else if(pressed.right)
        {
            if(player.sprite.x < other.sprite.x)
            {
                player.velocity.x = 0;
            }
        }
        if(pressed.down)
        {
            if(player.sprite.y < other.sprite.y)
            {
                player.velocity.y = 0;
            }
        }
        else if(pressed.up)
        {
            if(player.sprite.y > other.sprite.y + other.sprite.height - player.sprite.height/2)
            {
                player.velocity.y = 0;
            }
        }
        return true;
    }
    return false;
}