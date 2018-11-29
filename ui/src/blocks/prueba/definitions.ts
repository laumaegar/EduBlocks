export default function define(Blocks: Blockly.BlockDefinitions) {
 Blocks['import_prueba'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("import mylib");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(218);
 this.setTooltip("Imports mylib ");
 this.setHelpUrl("");
  }
};
 
}
