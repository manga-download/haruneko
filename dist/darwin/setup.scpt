tell application "Finder"
    tell disk "HakuNeko"
        open
        set current view of container window to icon view
        set toolbar visible of container window to false
        set statusbar visible of container window to false
        set the bounds of container window to {100, 100, 580, 620}
        set theViewOptions to the icon view options of container window
        set arrangement of theViewOptions to not arranged
        set icon size of theViewOptions to 64
        set background picture of theViewOptions to file ".images:setup.png"
        make new alias file at container window to POSIX file "/Applications" with properties {name:"Applications"}
        set position of item "HakuNeko.app" of container window to {360, 180}
        set position of item "Applications" of container window to {360, 390}
        set position of item ".fseventsd" of container window to {180, 620}
        set position of item ".images" of container window to {280, 620}
        try
            set position of item ".CacheDeleteDiscardedCaches" of container window to {230, 720}
        end try
        update without registering applications
        delay 5
        close
    end tell
end tell