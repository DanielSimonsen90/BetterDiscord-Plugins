### [DanhoBetterChat](/dist/bd/DanhoBetterChat.plugin.js) <sub><sup>`v.1.2.0` *(Updated: 05/08/2022)*</sup></sub>
Personal chat features.

#### Features
* @someone
    - Pings a random user that has access to view the current channel
* Auto timestamps
    - Send a timestamp using one of the following formats:
    > ```html
    > "<dd/MM/yyyy>" ➡ 03/05/2001
    > "<dd/MM/yy>" ➡ 03/05/01
    > "<dd-MM-yyyy>" ➡ 03-05-2001
    > "<dd-MM-yy>" ➡ 03-05-01
    >
    > "<HH>" ➡ 13
    > "<HH:mm>" ➡ 13:01
    > "<HH:mm:ss>" ➡ 13:01:30
    > "<HH:mm:ss:msms>" ➡ 13:01:30:3624
    >
    > "<HH>" ➡ 13
    > "<HH.mm>" ➡ 13.01
    > "<HH.mm.ss>" ➡ 13.01.30
    > "<HH.mm.ss.msms>" ➡ 13.01.30.3624
    >```
    Combine them all using "-" ➡ "<dd/MM/yyyy-HH:mm:ss>"
    Add ":\<style>" at end ➡ "<dd/MM/yyyy-HH:mm:ss:R>" - see available styles [here](https://discord.com/developers/docs/reference#message-formatting-timestamp-styles).
* Custom commands
    > prefix: `!bdd`
    > **Commands**
    > * say @message=<string>
    > * spag-smells

> **Features to implement**
> * Display properties using ${this.<property>}?