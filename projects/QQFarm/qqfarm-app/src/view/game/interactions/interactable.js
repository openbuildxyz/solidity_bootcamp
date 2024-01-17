import { checkCollision } from "./collision.js";
// ----- Setting dialogue ------
export function checkInteraction(interactable, text, dialogueBox, isConversing, pressed, player, dialogueText) {
    if (interactable.type === "npc") {
        isConversing = true;
    }

    dialogueBox.x = window.scrollX + window.innerWidth/2 - 960/2;
    dialogueBox.y = window.scrollY + window.innerHeight - 192 - 20;

    const collision = checkCollision(interactable);
    if (collision && pressed.e) {
        dialogueBox.visible = true;
        dialogueText.text = text;
        player.freeze();
    }
    if (dialogueBox.visible && (pressed.x || (isConversing && (pressed["1"] || pressed["2"])))) {
        dialogueBox.visible = false;
        player.unfreeze();
    }
    return collision;
}