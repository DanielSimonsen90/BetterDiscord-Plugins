const { React, CompiledReact } = window.BDD?.Modules;
const { Button } = CompiledReact.Components;

const { marginTop20 } = window.ZLibrary.DiscordClassModules.Margins;

type EditBioButtonProps = {
    onClick: () => void
}
export default function EditBioButton({ onClick }: EditBioButtonProps) {
    return (
        <div className='edit-bio-button'>
            {Button ?
                <Button className={marginTop20} look={Button.Looks.OUTLINED}
                    color={Button.Colors.WHITE} onClick={onClick}
                >Edit Bio</Button> :
                <p className='error'>But component not found.</p>
            }
        </div>
    );
}