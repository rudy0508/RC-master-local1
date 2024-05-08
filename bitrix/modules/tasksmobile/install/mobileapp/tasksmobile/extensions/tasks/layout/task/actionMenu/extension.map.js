{"version":3,"sources":["extension.js"],"names":["jn","define","require","exports","module","Loc","TaskCreateManager","EventEmitter","ActionMenu","constructor","options","this","layoutWidget","possibleActions","diskFolderId","deadlines","isTaskLimitExceeded","task","eventEmitter","createWithUid","id","show","contextMenu","ContextMenu","params","showCancelButton","title","getMessage","actions","filter","action","includes","approve","map","onClickCallback","Promise","resolve","close","closeMenu","testId","pathToImages","imagePrefix","currentDomain","data","imgUri","open","currentUser","addToFavorite","removeFromFavorite","updateActions","canStart","canPause","canRenew","start","emit","pause","complete","isResultRequired","isOpenResultExists","renew","canApprove","canDisapprove","canComplete","disapprove","isDisabled","selector","EntitySelectorFactory","createByType","provider","context","initSelectedIds","responsible","allowMultipleSelection","events","onClose","users","newResponsible","oldResponsible","Number","updateData","name","icon","defaultImage","imageUrl","delegate","then","widgetParams","backdrop","mediumPositionPercent","removeContextMenu","BX","message","setTimeout","Notify","showIndicatorLoading","remove","response","result","back","showMessage","hideCurrentIndicator"],"mappings":"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","file":"extension.map.js"}