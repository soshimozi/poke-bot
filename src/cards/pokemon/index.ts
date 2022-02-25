import Canvas from "canvas";
import * as fs from "fs";

export default class PokemonCard {
    private radiusCorner: string;
    private colorBackground: string;
    private pokemonAvatar: string | Buffer;
    private backgroundImage: string | Buffer;
    private opacityPokemonAvatar: string;
    private borderWidth: string;
    private borderColor: string;

    constructor() {
        this.radiusCorner = "20"
        this.colorBackground = "#000000"
        this.pokemonAvatar = `${__dirname}/../../../assets/img/default-avatar.png`
        this.backgroundImage = `${__dirname}/../../../assets/img/1px.png`
        this.opacityPokemonAvatar = "0.4";
        this.borderWidth = "0"
        this.borderColor = "Black"
    }

    setOpacityAvatar(val: string) {
        this.opacityPokemonAvatar = val
        return this
    }
    setRadiusCorner(val: string) {
        this.radiusCorner = val
        return this
    }

    setPokemonAvatar(val: string | Buffer) {
        this.pokemonAvatar = val
        return this
    }
    setColorBackground(val: string) {
        this.colorBackground = val
        return this
    }

    setBorderColor(val: string) {
        this.borderColor = val
        return this
    }

    setBorderWidth(val: string) {
        this.borderWidth = val
        return this
    }

    async toAttachment() {
        let canvas = Canvas.createCanvas(1080, 400),
            ctx = canvas.getContext("2d");


        await this.drawBackground(ctx);


        // Draw layer

        ctx.fillStyle = "#000000";
        ctx.globalAlpha = Number(this.opacityPokemonAvatar);
        ctx.fillRect(0, 0, 240, canvas.height);
        ctx.globalAlpha = 1;

        ctx.beginPath()
        ctx.moveTo(240, 0)
        ctx.lineTo(240, canvas.height)
        ctx.closePath()

        ctx.strokeStyle = this.borderColor
        ctx.lineWidth = Number(this.borderWidth)
        ctx.stroke()


        // Avatar
        let avatar = await Canvas.loadImage(this.pokemonAvatar);
        ctx.drawImage(avatar, 10, 10, 220, 220);

        await this.drawBorder(ctx);

        return canvas;
    }

    private async drawBorder(ctx: Canvas.CanvasRenderingContext2D) {

        // draw border
        this.drawBackgroundPath(ctx);

        ctx.strokeStyle = this.borderColor
        ctx.lineWidth = Number(this.borderWidth)

        ctx.stroke()
    }

    private drawBackgroundPath(ctx: Canvas.CanvasRenderingContext2D) {
        ctx.beginPath();

        const borderWidth = Number(this.borderWidth)
        ctx.moveTo(0 + Number(this.radiusCorner) + borderWidth, borderWidth);
        ctx.lineTo(0 + 1080 - Number(this.radiusCorner), borderWidth);
        ctx.quadraticCurveTo(borderWidth + 1080, 0, borderWidth + 1080, borderWidth + Number(this.radiusCorner));
        ctx.lineTo(borderWidth + 1080, borderWidth + 400 - Number(this.radiusCorner));
        ctx.quadraticCurveTo(
            borderWidth + 1080,
            borderWidth + 400,
            borderWidth + 1080 - Number(this.radiusCorner),
            borderWidth + 400
        );
        ctx.lineTo(0 + Number(this.radiusCorner), 0 + 400);
        ctx.quadraticCurveTo(0, 0 + 400, 0, 0 + 400 - Number(this.radiusCorner));
        ctx.lineTo(0, 0 + Number(this.radiusCorner));
        ctx.quadraticCurveTo(0, 0, 0 + Number(this.radiusCorner), 0);
        ctx.closePath();
    }

    private async drawBackground(ctx: Canvas.CanvasRenderingContext2D) {

        this.drawBackgroundPath(ctx)

        ctx.clip()

        ctx.fillStyle = this.colorBackground;
        ctx.fillRect(0, 0, 1080, 400);

        let background = await Canvas.loadImage(this.backgroundImage);
        ctx.drawImage(background, 0, 0, 1080, 400);
        ctx.restore();
    }
}
