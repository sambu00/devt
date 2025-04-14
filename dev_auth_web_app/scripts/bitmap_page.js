const MAX_BITS = 128;

$(document).ready(function(){
    let bitmap = new Bitmap($("#hexp_bitmap1"), $("#hexp_bitmap2"), $("#hexhi_bitmap"), $("#hexlo_bitmap"));
    bitmap_tb = $("#bitmap_table")
    
    let col_ctr = 0;
    cells = []

    for (let i = 0; i < MAX_BITS; i++) {
     
        if (col_ctr == 0) {
            cells = []    
        }
        cell = $(generate_bit_label(i))
        bitmap.add_bit({bool: false, td: cell})

        cells.push(cell)
        
        col_ctr ++
        if (col_ctr >= 16) {
            bitmap_row = $(document.createElement("tr"))
            bitmap_row.append(cells[0], cells[1], cells[2], cells[3], cells[4], cells[5], cells[6], cells[7],
                              cells[8], cells[9], cells[10], cells[11], cells[12], cells[13], cells[14], cells[15])
            bitmap_tb.append(bitmap_row)
            col_ctr = 0
        }
    }
    
    bitmap.set_bitmap_text_area()

});

function generate_bit_label(bit_position) {
    bit_label = $(document.createElement("td"))
    bit_label.text(bit_position + 1)
    $(bit_label).addClass('bitmap')

    return bit_label;
}


function Bitmap( text_plan_1, text_plan_2, text_hi, text_lo) {
    this.bits = []
    
    this.text_plan_1 = text_plan_1;
    this.text_plan_2 = text_plan_2;
    this.text_hi = text_hi;
    this.text_lo =  text_lo;
 
    this.text_plan_1.on("keyup", {bitmap: this}, function(par) {
        // skip non hex digit value
        if (!is_key_valid_for_bitmap(par.which)) {
            return
        }
        
        // bits 0 - 63         
        binary_bitmap = hex_to_binary(par.data.bitmap.text_plan_1.val())

        for (i = 0; i < binary_bitmap.length; i++) {
            if (binary_bitmap[i] == "1") {
                par.data.bitmap.set_bit(i, true)
            }
            if (binary_bitmap[i] == "0") {
                par.data.bitmap.set_bit(i, false)
            }
        }

        //set hex_bitmap
        par.data.bitmap.set_bitmap_text_area()

    })

    this.text_plan_2.on("keyup", {bitmap: this}, function(par) {
        // skip non hex digit value
        if (!is_key_valid_for_bitmap(par.which)) {
            return
        }
        
        // bits 64 - 127
        binary_bitmap = hex_to_binary(par.data.bitmap.text_plan_2.val())

        for (i = 0; i < binary_bitmap.length; i++) {
            bitmap2_idx = i + 64
            if (binary_bitmap[i] == "1") {
                par.data.bitmap.set_bit(bitmap2_idx, true)
            }
            if (binary_bitmap[i] == "0") {
                par.data.bitmap.set_bit(bitmap2_idx, false)
            }
        }        

        //set hex_bitmap
        par.data.bitmap.set_bitmap_text_area()

    })

    this.text_hi.on("keyup", {bitmap: this}, function(par) {
        // skip non hex digit value
        if (!is_key_valid_for_bitmap(par.which)) {
            return
        }
       
        // odd bits
        binary_bitmap = hex_to_binary(par.data.bitmap.text_hi.val())

        for (i = 0; i < binary_bitmap.length; i++) { 

            hi_idx = Math.floor(i / 4) * 8 + (i % 4)

            if (binary_bitmap[i] == "1") {
                par.data.bitmap.set_bit(hi_idx, true)
            }
            if (binary_bitmap[i] == "0") {
                par.data.bitmap.set_bit(hi_idx, false)
            }
        }

        //set hex_bitmap
        par.data.bitmap.set_bitmap_text_area()
    })

    this.text_lo.on("keyup", {bitmap: this}, function(par) {
        // skip non hex digit value
        if (!is_key_valid_for_bitmap(par.which)) {
            return
        }

        // even bits
        binary_bitmap = hex_to_binary(par.data.bitmap.text_lo.val())

        for (i = 0; i < binary_bitmap.length; i++) {
            lo_idx = Math.floor(i / 4) * 8 + (i % 4) + 4

            if (binary_bitmap[i] == "1") {
                par.data.bitmap.set_bit(lo_idx, true)
            }
            if (binary_bitmap[i] == "0") {
                par.data.bitmap.set_bit(lo_idx, false)
            }
        }

        //set hex_bitmap
        par.data.bitmap.set_bitmap_text_area()
    })


    this.add_bit = function(par) {
        bool = par.bool
        td = par.td

        if (bool) {
            td.addClass("bit-on")
        }
        
        last_index = this.bits.push({bool: bool, td: td}) - 1
        
        td.on("click", {de_obj: this, bit_position: last_index}, function(p) {
            p.data.de_obj.switch_bit(p.data.bit_position)
        })
    }

    this.set_bit = function(bit, bool) {
        this.bits[bit].bool = bool
        if (this.bits[bit].bool) {
            this.bits[bit].td.addClass("bit-on")
        } else {
            this.bits[bit].td.removeClass("bit-on")
        }
    }

    this.switch_bit = function(bit) {
        de_obj = this.bits[bit]
        de_obj.bool = !de_obj.bool
        if (de_obj.bool) {
            de_obj.td.addClass("bit-on")
        } else {
            de_obj.td.removeClass("bit-on")
        }
        this.set_bitmap_text_area()
    }


    this.to_binary_bitmap = function() {
        binary_bitmap = ''

        for (i = 0; i < MAX_BITS; i++) {
            if (this.bits[i].bool) {
                binary_bitmap += "1"
            } else {
                binary_bitmap += "0"
            }
        }

        return binary_bitmap
    }

    this.to_hex_bitmap = function() {
        hex_bitmap = ''

        binary_bitmap = this.to_binary_bitmap()

        for (i = 0; i < binary_bitmap.length; i += 4) {
            parsed_nbr = parseInt(binary_bitmap.slice(i, i + 4), 2)
            hex_bitmap += parsed_nbr.toString(16).toUpperCase()
        }

        return hex_bitmap
    }

    this.set_bitmap_text_area = function() {
        hex_bitmap = this.to_hex_bitmap()

        this.text_plan_1.val(hex_bitmap.slice(0, 16))
        this.text_plan_2.val(hex_bitmap.slice(16, 32))

        split_on_hi_lo = split_hi_lo_order(hex_bitmap)

        this.text_hi.val(split_on_hi_lo.hi)
        this.text_lo.val(split_on_hi_lo.lo)

    }

}

function hex_to_binary(hex_string) {
    binary = ''
    for (i = 0; i < hex_string.length; i +=2 ) {
        parsed_nbr = parseInt(hex_string.slice(i, i + 2), 16)
        binary += parsed_nbr.toString(2).padStart(8, "0")
    }
    return binary;
}

function split_hi_lo_order(hex_string) {
    max_len = hex_string.length;

    hex_hi_string = '';
    hex_lo_string = '';

    is_hi_bit = true

    for (i = 0; i < hex_string.length; i++) {
        if (is_hi_bit) {
            hex_hi_string += hex_string[i]
        } else {
            hex_lo_string += hex_string[i]
        }
        is_hi_bit = !is_hi_bit;
    }

    return {hi: hex_hi_string, lo: hex_lo_string}
}

function is_key_valid_for_bitmap(key_value) {
    if (key_value < 48) {
        return false
    }
    if (key_value > 58 && key_value < 65) {
        return false
    }
    if (key_value > 70 && key_value != 86) {
        return false
    }

    return true
}