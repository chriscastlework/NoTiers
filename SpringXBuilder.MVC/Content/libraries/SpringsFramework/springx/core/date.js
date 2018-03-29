sp.namespace("spx.core.Date");

spx.core.Date = sp.core.date.Date.extend
(
    {
        toFormattedString: function (f)
        {
            return this.getFormatStr(f);
        },

        getFormatStr: function (str)
        {
            if(!str || !str.length) return "";
            var options = ["yyyy","y","yy","m","M","MM","mm","Ms","d","dd","D","Ds","Dl","dS","h","mn","s","mls"];
            var result = "";
            while(str.length)
            {
                var longestMatch = str.substr(0,1);
                for(var i=0; i<options.length; i++) if(str.indexOf(options[i])==0) if(options[i].length>longestMatch.length) longestMatch = options[i];
                result += this.formatDatePart(longestMatch);
                str = str.substr(longestMatch.length);
            }
            return result;
        },

        formatDatePart: function (p)
        {
            switch (p)
            {
                case "yyyy":
                    return "" + this.getFullYear();
                    break
                case "y":
                    return "" + this.getYear();
                    break;
                case "yy":
                    return "" + this.getFullYear();
                    break;
                case "m":
                    return "" + this.getMonth();
                    break;
                case "mm":
                    return this.getFullMonth();
                    break
                case "M":
                case "MM":
                    return this.getMonthName();
                    break;
                case "Ms":
                    return this.getShortMonthName();
                    break;
                case "d":
                    return "" + this.getDayOfMonth();
                    break
                case "dd":
                    return this.getFullDayOfMonth();
                case "D":
                    return this.format.getDayName(this.date.getDay());
                    break;
                case "Ds":
                    return this.format.getShortDayName(this.date.getDay());
                    break;
                case "Dl":
                    return this.format.getDayLetter(this.date.getDay());
                    break;
                case "dS":
                    return this.date.getDate() + this.format.getDateSuffix(this.date.getDate());
                    break;
                case "h":
                    return this.addLeading(this.date.getHours(), 2);
                    break;
                case "mn":
                    return this.addLeading(this.date.getMinutes(), 2);
                    break;
                case "s":
                    return this.addLeading(this.date.getSeconds(), 2);
                    break;
                case "mls":
                    return this.addLeading(this.date.getMilliseconds(), 3); //Mike Changed this from 4, to 3
                    break;
            }
            return p;
        }
    }
)
