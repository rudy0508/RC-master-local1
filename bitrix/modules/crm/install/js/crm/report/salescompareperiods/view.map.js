{"version":3,"sources":["view.js"],"names":["BX","namespace","Crm","Report","Dashboard","Content","SalesComparePeriods","filter","timePeriodField","previousPeriodField","init","filterId","setTimeout","this","Main","filterManager","getById","getEmitter","subscribe","onFilterFieldInit","bind","console","error","renderBalloon","graphDataItem","graph","data","dataContext","balloon","amountCurrentFormatted","amountPrevFormatted","util","htmlspecialchars","dateCurrent","datePrev","message","renderPercentBlock","amountCurrent","amountPrev","currentAmount","prevAmount","ratio","classList","percent","Math","round","toString","event","field","id","onTimePeriodChange","previousValue","preparePreviousPeriodValue","value","setValue","currentPeriodValue","result","_datesel","_from","_to","currentDate","Date","monthToQuarter","dateFormat","date","convertBitrixFormat","currentQuarter","getMonth","_quarter","_year","getFullYear","setPreviousPeriodDates","weekStart","setDate","getDate","getDay","weekEnd","valueOf","format","_month","key","hasOwnProperty","periodLength","from","to"],"mappings":"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","file":"view.map.js"}