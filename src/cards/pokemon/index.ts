import Canvas from "canvas";
import * as fs from "fs";
import {PokemonAbilities} from "../../PokemonRepository";
import {applyText} from "../../utils";

export default class PokemonCard {
    private radiusCorner: string;
    private colorBackground: string;
    private pokemonAvatar: string | Buffer;
    private backgroundImage: string | Buffer;
    private opacityPokemonAvatar: string;
    private borderWidth: string;
    private borderColor: string;
    private pokemonName: string;
    private pokemonType: string[]
    private pokemonSpecies: string
    private colorType: string;
    private colorName: string;
    private colorSpecies: string;
    private baseExperience: string;
    private experienceColor: string;

    constructor() {
        this.radiusCorner = "20"
        this.colorBackground = "#000000"
        this.pokemonAvatar = `${__dirname}/../../../assets/img/default-avatar.png`
        this.backgroundImage = `${__dirname}/../../../assets/img/1px.png`
        this.opacityPokemonAvatar = "0.4";
        this.borderWidth = "0"
        this.pokemonName = ""
        this.pokemonType = []
        this.pokemonSpecies = ""
        this.borderColor = "#000000"
        this.colorType = "#000000"
        this.colorName = "#000000"
        this.colorSpecies = "#000000"
        this.baseExperience = ""
        this.experienceColor = "#000000"
    }

    addType(name: string) {
        this.pokemonType.push(name)
        return this
    }

    setOpacityAvatar(val: string) {
        this.opacityPokemonAvatar = val
        return this
    }

    setRadiusCorner(val: string) {
        this.radiusCorner = val
        return this
    }

    setPokemonName(val: string) {
        this.pokemonName = val
        return this
    }

    setColorName(val: string) {
        this.colorName = val
        return this
    }

    setColorType(val: string) {
        this.colorType = val
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

    setPokemonSpecies(val: string) {
        this.pokemonSpecies = val
        return this
    }

    setColorSpecies(val: string) {
        this.colorSpecies = val
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
        ctx.drawImage(avatar, 10, 64, 220, 220);

        ctx.fillStyle = this.colorName
        ctx.textAlign = "center"

        ctx.font = applyText(canvas, this.pokemonName, 48, 220, "Bold")
        ctx.fillText(this.pokemonName, 120, 48)

        //await this.drawBorder(ctx);

        ctx.fillStyle = this.colorSpecies
        ctx.textAlign = "left"
        ctx.font = applyText(canvas, this.pokemonSpecies, 32, 800, "Bold")
        ctx.fillText(this.pokemonSpecies, 260, 32)
        let tm = ctx.measureText(this.pokemonSpecies)
        console.log(tm)

        ctx.fillStyle = this.colorType;
        ctx.textAlign = "left";

        ctx.font = applyText(canvas, "Types:", 32, 170, "Bold")
        ctx.fillText("Types: ", 260, 256)

        this.pokemonType.forEach((t, i) => {
            ctx.font = applyText(canvas, t, 32, 170, "Sans")
            ctx.fillText(t, 260, 256 + (i + 1) * 32)
        })

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

        ctx.moveTo(0 + Number(this.radiusCorner), 0);
        ctx.lineTo(0 + 1080 - Number(this.radiusCorner), 0);
        ctx.quadraticCurveTo(0 + 1080, 0, 0 + 1080, 0 + Number(this.radiusCorner));
        ctx.lineTo(0 + 1080, 0 + 400 - Number(this.radiusCorner));
        ctx.quadraticCurveTo(
            0 + 1080,
            0 + 400,
            0 + 1080 - Number(this.radiusCorner),
            0 + 400
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
