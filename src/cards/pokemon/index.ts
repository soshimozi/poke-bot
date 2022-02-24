import Canvas from "canvas";
import * as fs from "fs";

export default class PokemonCard {
    private radiusCorner: string;
    private colorBackground: string;
    private pokemonAvatar: string | Buffer;
    private backgroundImage: string | Buffer;
    private opacityPokemonAvatar: string;

    constructor() {
        this.radiusCorner = "20"
        this.colorBackground = "#000000"
        this.pokemonAvatar = `${__dirname}/../../../assets/img/default-avatar.png`
        this.backgroundImage = `${__dirname}/../../../assets/img/1px.png`
        this.opacityPokemonAvatar = "0.4";
/*
        const dir = `${__dirname}/../../../assets/img`
        console.log(dir)

        fs.readdir(dir, function (err, files) {
            //handling error
            if (err) {
                return console.log('Unable to scan directory: ' + err);
            }
            //listing all files using forEach
            files.forEach(function (file) {
                // Do whatever you want to do with the file
                console.log(file);
            });
        });
 */
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

    async toAttachment() {
        let canvas = Canvas.createCanvas(1080, 400),
            ctx = canvas.getContext("2d");

        // Background
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
        ctx.clip();
        ctx.fillStyle = this.colorBackground;
        ctx.fillRect(0, 0, 1080, 400);

        let background = await Canvas.loadImage(this.backgroundImage);
        ctx.drawImage(background, 0, 0, 1080, 400);
        ctx.restore();

        // Draw layer
        ctx.fillStyle = "#000000";
        ctx.globalAlpha = Number(this.opacityPokemonAvatar);
        ctx.fillRect(50, 0, 240, canvas.height);
        ctx.globalAlpha = 1;

        // Avatar
        let avatar = await Canvas.loadImage(this.pokemonAvatar);
        ctx.drawImage(avatar, 50 + 30, 30, 180, 180);
        return canvas;
    }
}
