ps
ps -c | grep Python | awk '{ printf("%s\t%s\t%s\t%s\t%s\t%s\t%s\t%s\t%s\t%s\t%s\n",$1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11);}' | cut -f1 | while read line; do
 echo "KILL PID $line START"
 kill $line
 echo "KILL PID $line DONE\n"
 done