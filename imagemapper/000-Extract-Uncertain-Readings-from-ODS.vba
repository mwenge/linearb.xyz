Dim oDoc as Object, oSheet as Object, oCell as Object
Dim oTextCursor as Object
    oDoc=ThisComponent
    oSheet=oDoc.getSheets().getByindex(0)
    oCell=oSheet.getCellByPosition(0,1)
    oCell.String="The Moon is in synchronous rotation with Earth, always showing the same face with its near side marked by dark volcanic maria that fill between the bright ancient crustal highlands and the prominent impact craters. It is the second-brightest object in the sky, after the Sun (measured by illuminance on the surface of the Earth)"
    with oCell
        .CharFontName = "Arial"
        '.CharPosture = com.sun.star.awt.FontSlant.ITALIC
        .CharHeight=12      
    end with

str_length = len (oCell.String)

str_searched = "ea"
str_searched_length = len (str_searched)

oTextCursor = oCell.createTextCursor()

for i = 1 to str_length
    found = instr (i, oCell.String, str_searched)
    if found > 0 then
            With oTextCursor
                .gotoStart( False )
                .goRight(found-1 , False )  
                .goRight(str_searched_length, True )
                .setPropertyValue("CharColor",0099000)  
                .gotoEnd( False )
            End with
        i = i + found+str_searched_length
    endif
next i
