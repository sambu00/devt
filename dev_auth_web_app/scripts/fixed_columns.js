
$(document).ready(function(){

    in_obj = {in_area: $("#input-area"), cols: $("#columns"), cr_toggle: $("#keep-new-line"), out_area: $("#output-area")}

    $("#input-area").on("keyup", in_obj, fixed_cols_output)

    $("#columns").on("keyup", in_obj, fixed_cols_output)

    $("#keep-new-line").on("click", in_obj, fixed_cols_output)

})

function fixed_cols_output(event) {
    in_str  = ''

    if (event.data.cr_toggle.prop("checked")) {
        in_str = event.data.in_area.val()
    } else {
        in_str = event.data.in_area.val().replaceAll(/\r?\n|\r/g, "")
    }

    cols = parseInt(event.data.cols.val())

    out_str = ''
    if (cols != 0) {
        for (i = 0; i < in_str.length; i += cols) {
            out_str += in_str.slice(i, i + cols)
            out_str += "\n"
        }
    
        event.data.out_area.val(out_str)
    }

}