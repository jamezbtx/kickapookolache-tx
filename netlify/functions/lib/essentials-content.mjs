/**
 * Curated daily essentials content (no AI needed).
 * SCRIPTURES: King James Version (public domain); each verse text checked word-for-word against two
 *   independent KJV sources (api.getbible.net KJV and the thiagobodruk/bible en_kjv.json dataset).
 * ALMANAC_TIPS: East Texas (USDA zone 8a/8b) seasonal tips; months are 1-12.
 * JOKES: clean, church-bulletin-safe, wholesome and light; the first 12 are the best of the batch.
 *   NO dark humor (James, 2026-10-17): no death/dying/afterlife-as-death, injury, illness or disability,
 *   violence, crime, misfortune/disaster, mean-spirited or insult humor, and no politics. Punchline must be
 *   clear, easy to get and straightforward, never obscure. Entries removed 2026-10-17 for dark themes.
 */
export const SCRIPTURES = [
  {"ref": "Psalm 23:1", "text": "The LORD is my shepherd; I shall not want."},
  {"ref": "Psalm 23:4", "text": "Yea, though I walk through the valley of the shadow of death, I will fear no evil: for thou art with me; thy rod and thy staff they comfort me."},
  {"ref": "Psalm 23:6", "text": "Surely goodness and mercy shall follow me all the days of my life: and I will dwell in the house of the LORD for ever."},
  {"ref": "Psalm 27:1", "text": "The LORD is my light and my salvation; whom shall I fear? the LORD is the strength of my life; of whom shall I be afraid?"},
  {"ref": "Psalm 27:14", "text": "Wait on the LORD: be of good courage, and he shall strengthen thine heart: wait, I say, on the LORD."},
  {"ref": "Psalm 28:7", "text": "The LORD is my strength and my shield; my heart trusted in him, and I am helped: therefore my heart greatly rejoiceth; and with my song will I praise him."},
  {"ref": "Psalm 29:11", "text": "The LORD will give strength unto his people; the LORD will bless his people with peace."},
  {"ref": "Psalm 30:5", "text": "For his anger endureth but a moment; in his favour is life: weeping may endure for a night, but joy cometh in the morning."},
  {"ref": "Psalm 31:24", "text": "Be of good courage, and he shall strengthen your heart, all ye that hope in the LORD."},
  {"ref": "Psalm 32:8", "text": "I will instruct thee and teach thee in the way which thou shalt go: I will guide thee with mine eye."},
  {"ref": "Psalm 34:1", "text": "I will bless the LORD at all times: his praise shall continually be in my mouth."},
  {"ref": "Psalm 34:8", "text": "O taste and see that the LORD is good: blessed is the man that trusteth in him."},
  {"ref": "Psalm 34:18", "text": "The LORD is nigh unto them that are of a broken heart; and saveth such as be of a contrite spirit."},
  {"ref": "Psalm 37:4", "text": "Delight thyself also in the LORD; and he shall give thee the desires of thine heart."},
  {"ref": "Psalm 37:5", "text": "Commit thy way unto the LORD; trust also in him; and he shall bring it to pass."},
  {"ref": "Psalm 37:7", "text": "Rest in the LORD, and wait patiently for him: fret not thyself because of him who prospereth in his way, because of the man who bringeth wicked devices to pass."},
  {"ref": "Psalm 37:23", "text": "The steps of a good man are ordered by the LORD: and he delighteth in his way."},
  {"ref": "Psalm 46:1", "text": "God is our refuge and strength, a very present help in trouble."},
  {"ref": "Psalm 46:10", "text": "Be still, and know that I am God: I will be exalted among the heathen, I will be exalted in the earth."},
  {"ref": "Psalm 48:14", "text": "For this God is our God for ever and ever: he will be our guide even unto death."},
  {"ref": "Psalm 50:15", "text": "And call upon me in the day of trouble: I will deliver thee, and thou shalt glorify me."},
  {"ref": "Psalm 55:22", "text": "Cast thy burden upon the LORD, and he shall sustain thee: he shall never suffer the righteous to be moved."},
  {"ref": "Psalm 56:3", "text": "What time I am afraid, I will trust in thee."},
  {"ref": "Psalm 62:1", "text": "Truly my soul waiteth upon God: from him cometh my salvation."},
  {"ref": "Psalm 84:11", "text": "For the LORD God is a sun and shield: the LORD will give grace and glory: no good thing will he withhold from them that walk uprightly."},
  {"ref": "Psalm 86:5", "text": "For thou, Lord, art good, and ready to forgive; and plenteous in mercy unto all them that call upon thee."},
  {"ref": "Psalm 91:1", "text": "He that dwelleth in the secret place of the most High shall abide under the shadow of the Almighty."},
  {"ref": "Psalm 91:2", "text": "I will say of the LORD, He is my refuge and my fortress: my God; in him will I trust."},
  {"ref": "Psalm 91:11", "text": "For he shall give his angels charge over thee, to keep thee in all thy ways."},
  {"ref": "Psalm 94:19", "text": "In the multitude of my thoughts within me thy comforts delight my soul."},
  {"ref": "Psalm 95:1", "text": "O come, let us sing unto the LORD: let us make a joyful noise to the rock of our salvation."},
  {"ref": "Psalm 100:1", "text": "Make a joyful noise unto the LORD, all ye lands."},
  {"ref": "Psalm 100:4", "text": "Enter into his gates with thanksgiving, and into his courts with praise: be thankful unto him, and bless his name."},
  {"ref": "Psalm 100:5", "text": "For the LORD is good; his mercy is everlasting; and his truth endureth to all generations."},
  {"ref": "Psalm 103:2", "text": "Bless the LORD, O my soul, and forget not all his benefits."},
  {"ref": "Psalm 103:8", "text": "The LORD is merciful and gracious, slow to anger, and plenteous in mercy."},
  {"ref": "Psalm 103:12", "text": "As far as the east is from the west, so far hath he removed our transgressions from us."},
  {"ref": "Psalm 107:1", "text": "O give thanks unto the LORD, for he is good: for his mercy endureth for ever."},
  {"ref": "Psalm 118:6", "text": "The LORD is on my side; I will not fear: what can man do unto me?"},
  {"ref": "Psalm 118:24", "text": "This is the day which the LORD hath made; we will rejoice and be glad in it."},
  {"ref": "Psalm 119:11", "text": "Thy word have I hid in mine heart, that I might not sin against thee."},
  {"ref": "Psalm 119:105", "text": "Thy word is a lamp unto my feet, and a light unto my path."},
  {"ref": "Psalm 121:1", "text": "I will lift up mine eyes unto the hills, from whence cometh my help."},
  {"ref": "Psalm 121:2", "text": "My help cometh from the LORD, which made heaven and earth."},
  {"ref": "Psalm 121:8", "text": "The LORD shall preserve thy going out and thy coming in from this time forth, and even for evermore."},
  {"ref": "Psalm 122:1", "text": "I was glad when they said unto me, Let us go into the house of the LORD."},
  {"ref": "Psalm 126:3", "text": "The LORD hath done great things for us; whereof we are glad."},
  {"ref": "Psalm 127:1", "text": "Except the LORD build the house, they labour in vain that build it: except the LORD keep the city, the watchman waketh but in vain."},
  {"ref": "Psalm 133:1", "text": "Behold, how good and how pleasant it is for brethren to dwell together in unity!"},
  {"ref": "Psalm 136:1", "text": "O give thanks unto the LORD; for he is good: for his mercy endureth for ever."},
  {"ref": "Psalm 139:14", "text": "I will praise thee; for I am fearfully and wonderfully made: marvellous are thy works; and that my soul knoweth right well."},
  {"ref": "Psalm 143:8", "text": "Cause me to hear thy lovingkindness in the morning; for in thee do I trust: cause me to know the way wherein I should walk; for I lift up my soul unto thee."},
  {"ref": "Psalm 145:18", "text": "The LORD is nigh unto all them that call upon him, to all that call upon him in truth."},
  {"ref": "Psalm 147:3", "text": "He healeth the broken in heart, and bindeth up their wounds."},
  {"ref": "Psalm 19:1", "text": "The heavens declare the glory of God; and the firmament sheweth his handywork."},
  {"ref": "Psalm 24:1", "text": "The earth is the LORD's, and the fulness thereof; the world, and they that dwell therein."},
  {"ref": "Psalm 65:11", "text": "Thou crownest the year with thy goodness; and thy paths drop fatness."},
  {"ref": "Psalm 104:14", "text": "He causeth the grass to grow for the cattle, and herb for the service of man: that he may bring forth food out of the earth."},
  {"ref": "Psalm 147:8", "text": "Who covereth the heaven with clouds, who prepareth rain for the earth, who maketh grass to grow upon the mountains."},
  {"ref": "Psalm 90:17", "text": "And let the beauty of the LORD our God be upon us: and establish thou the work of our hands upon us; yea, the work of our hands establish thou it."},
  {"ref": "Proverbs 3:5", "text": "Trust in the LORD with all thine heart; and lean not unto thine own understanding."},
  {"ref": "Proverbs 3:6", "text": "In all thy ways acknowledge him, and he shall direct thy paths."},
  {"ref": "Proverbs 3:9", "text": "Honour the LORD with thy substance, and with the firstfruits of all thine increase."},
  {"ref": "Proverbs 3:27", "text": "Withhold not good from them to whom it is due, when it is in the power of thine hand to do it."},
  {"ref": "Proverbs 4:23", "text": "Keep thy heart with all diligence; for out of it are the issues of life."},
  {"ref": "Proverbs 10:4", "text": "He becometh poor that dealeth with a slack hand: but the hand of the diligent maketh rich."},
  {"ref": "Proverbs 11:25", "text": "The liberal soul shall be made fat: and he that watereth shall be watered also himself."},
  {"ref": "Proverbs 12:25", "text": "Heaviness in the heart of man maketh it stoop: but a good word maketh it glad."},
  {"ref": "Proverbs 13:20", "text": "He that walketh with wise men shall be wise: but a companion of fools shall be destroyed."},
  {"ref": "Proverbs 14:23", "text": "In all labour there is profit: but the talk of the lips tendeth only to penury."},
  {"ref": "Proverbs 15:1", "text": "A soft answer turneth away wrath: but grievous words stir up anger."},
  {"ref": "Proverbs 15:13", "text": "A merry heart maketh a cheerful countenance: but by sorrow of the heart the spirit is broken."},
  {"ref": "Proverbs 15:23", "text": "A man hath joy by the answer of his mouth: and a word spoken in due season, how good is it!"},
  {"ref": "Proverbs 16:3", "text": "Commit thy works unto the LORD, and thy thoughts shall be established."},
  {"ref": "Proverbs 16:9", "text": "A man's heart deviseth his way: but the LORD directeth his steps."},
  {"ref": "Proverbs 16:24", "text": "Pleasant words are as an honeycomb, sweet to the soul, and health to the bones."},
  {"ref": "Proverbs 17:17", "text": "A friend loveth at all times, and a brother is born for adversity."},
  {"ref": "Proverbs 17:22", "text": "A merry heart doeth good like a medicine: but a broken spirit drieth the bones."},
  {"ref": "Proverbs 18:10", "text": "The name of the LORD is a strong tower: the righteous runneth into it, and is safe."},
  {"ref": "Proverbs 18:24", "text": "A man that hath friends must shew himself friendly: and there is a friend that sticketh closer than a brother."},
  {"ref": "Proverbs 19:11", "text": "The discretion of a man deferreth his anger; and it is his glory to pass over a transgression."},
  {"ref": "Proverbs 22:1", "text": "A good name is rather to be chosen than great riches, and loving favour rather than silver and gold."},
  {"ref": "Proverbs 22:6", "text": "Train up a child in the way he should go: and when he is old, he will not depart from it."},
  {"ref": "Proverbs 27:17", "text": "Iron sharpeneth iron; so a man sharpeneth the countenance of his friend."},
  {"ref": "Proverbs 27:1", "text": "Boast not thyself of to morrow; for thou knowest not what a day may bring forth."},
  {"ref": "Proverbs 31:25", "text": "Strength and honour are her clothing; and she shall rejoice in time to come."},
  {"ref": "Proverbs 21:5", "text": "The thoughts of the diligent tend only to plenteousness; but of every one that is hasty only to want."},
  {"ref": "Proverbs 12:10", "text": "A righteous man regardeth the life of his beast: but the tender mercies of the wicked are cruel."},
  {"ref": "Proverbs 27:23", "text": "Be thou diligent to know the state of thy flocks, and look well to thy herds."},
  {"ref": "Ecclesiastes 3:1", "text": "To every thing there is a season, and a time to every purpose under the heaven."},
  {"ref": "Ecclesiastes 4:9", "text": "Two are better than one; because they have a good reward for their labour."},
  {"ref": "Ecclesiastes 4:12", "text": "And if one prevail against him, two shall withstand him; and a threefold cord is not quickly broken."},
  {"ref": "Ecclesiastes 9:10", "text": "Whatsoever thy hand findeth to do, do it with thy might; for there is no work, nor device, nor knowledge, nor wisdom, in the grave, whither thou goest."},
  {"ref": "Ecclesiastes 11:1", "text": "Cast thy bread upon the waters: for thou shalt find it after many days."},
  {"ref": "Isaiah 26:3", "text": "Thou wilt keep him in perfect peace, whose mind is stayed on thee: because he trusteth in thee."},
  {"ref": "Isaiah 30:15", "text": "For thus saith the Lord GOD, the Holy One of Israel; In returning and rest shall ye be saved; in quietness and in confidence shall be your strength: and ye would not."},
  {"ref": "Isaiah 40:8", "text": "The grass withereth, the flower fadeth: but the word of our God shall stand for ever."},
  {"ref": "Isaiah 40:29", "text": "He giveth power to the faint; and to them that have no might he increaseth strength."},
  {"ref": "Isaiah 40:31", "text": "But they that wait upon the LORD shall renew their strength; they shall mount up with wings as eagles; they shall run, and not be weary; and they shall walk, and not faint."},
  {"ref": "Isaiah 41:10", "text": "Fear thou not; for I am with thee: be not dismayed; for I am thy God: I will strengthen thee; yea, I will help thee; yea, I will uphold thee with the right hand of my righteousness."},
  {"ref": "Isaiah 43:2", "text": "When thou passest through the waters, I will be with thee; and through the rivers, they shall not overflow thee: when thou walkest through the fire, thou shalt not be burned; neither shall the flame kindle upon thee."},
  {"ref": "Isaiah 55:12", "text": "For ye shall go out with joy, and be led forth with peace: the mountains and the hills shall break forth before you into singing, and all the trees of the field shall clap their hands."},
  {"ref": "Isaiah 58:11", "text": "And the LORD shall guide thee continually, and satisfy thy soul in drought, and make fat thy bones: and thou shalt be like a watered garden, and like a spring of water, whose waters fail not."},
  {"ref": "Jeremiah 17:7", "text": "Blessed is the man that trusteth in the LORD, and whose hope the LORD is."},
  {"ref": "Jeremiah 29:11", "text": "For I know the thoughts that I think toward you, saith the LORD, thoughts of peace, and not of evil, to give you an expected end."},
  {"ref": "Jeremiah 29:13", "text": "And ye shall seek me, and find me, when ye shall search for me with all your heart."},
  {"ref": "Lamentations 3:22", "text": "It is of the LORD's mercies that we are not consumed, because his compassions fail not."},
  {"ref": "Lamentations 3:23", "text": "They are new every morning: great is thy faithfulness."},
  {"ref": "Micah 6:8", "text": "He hath shewed thee, O man, what is good; and what doth the LORD require of thee, but to do justly, and to love mercy, and to walk humbly with thy God?"},
  {"ref": "Nahum 1:7", "text": "The LORD is good, a strong hold in the day of trouble; and he knoweth them that trust in him."},
  {"ref": "Zephaniah 3:17", "text": "The LORD thy God in the midst of thee is mighty; he will save, he will rejoice over thee with joy; he will rest in his love, he will joy over thee with singing."},
  {"ref": "Joshua 1:9", "text": "Have not I commanded thee? Be strong and of a good courage; be not afraid, neither be thou dismayed: for the LORD thy God is with thee whithersoever thou goest."},
  {"ref": "Deuteronomy 31:6", "text": "Be strong and of a good courage, fear not, nor be afraid of them: for the LORD thy God, he it is that doth go with thee; he will not fail thee, nor forsake thee."},
  {"ref": "Deuteronomy 33:27", "text": "The eternal God is thy refuge, and underneath are the everlasting arms: and he shall thrust out the enemy from before thee; and shall say, Destroy them."},
  {"ref": "Exodus 33:14", "text": "And he said, My presence shall go with thee, and I will give thee rest."},
  {"ref": "Numbers 6:24", "text": "The LORD bless thee, and keep thee."},
  {"ref": "Numbers 6:26", "text": "The LORD lift up his countenance upon thee, and give thee peace."},
  {"ref": "1 Chronicles 16:34", "text": "O give thanks unto the LORD; for he is good; for his mercy endureth for ever."},
  {"ref": "2 Chronicles 7:14", "text": "If my people, which are called by my name, shall humble themselves, and pray, and seek my face, and turn from their wicked ways; then will I hear from heaven, and will forgive their sin, and will heal their land."},
  {"ref": "Genesis 1:1", "text": "In the beginning God created the heaven and the earth."},
  {"ref": "Genesis 8:22", "text": "While the earth remaineth, seedtime and harvest, and cold and heat, and summer and winter, and day and night shall not cease."},
  {"ref": "Job 8:7", "text": "Though thy beginning was small, yet thy latter end should greatly increase."},
  {"ref": "1 Samuel 12:24", "text": "Only fear the LORD, and serve him in truth with all your heart: for consider how great things he hath done for you."},
  {"ref": "Matthew 5:9", "text": "Blessed are the peacemakers: for they shall be called the children of God."},
  {"ref": "Matthew 5:14", "text": "Ye are the light of the world. A city that is set on an hill cannot be hid."},
  {"ref": "Matthew 5:16", "text": "Let your light so shine before men, that they may see your good works, and glorify your Father which is in heaven."},
  {"ref": "Matthew 6:26", "text": "Behold the fowls of the air: for they sow not, neither do they reap, nor gather into barns; yet your heavenly Father feedeth them. Are ye not much better than they?"},
  {"ref": "Matthew 6:33", "text": "But seek ye first the kingdom of God, and his righteousness; and all these things shall be added unto you."},
  {"ref": "Matthew 6:34", "text": "Take therefore no thought for the morrow: for the morrow shall take thought for the things of itself. Sufficient unto the day is the evil thereof."},
  {"ref": "Matthew 7:7", "text": "Ask, and it shall be given you; seek, and ye shall find; knock, and it shall be opened unto you."},
  {"ref": "Matthew 11:28", "text": "Come unto me, all ye that labour and are heavy laden, and I will give you rest."},
  {"ref": "Matthew 11:29", "text": "Take my yoke upon you, and learn of me; for I am meek and lowly in heart: and ye shall find rest unto your souls."},
  {"ref": "Matthew 19:26", "text": "But Jesus beheld them, and said unto them, With men this is impossible; but with God all things are possible."},
  {"ref": "Matthew 22:37", "text": "Jesus said unto him, Thou shalt love the Lord thy God with all thy heart, and with all thy soul, and with all thy mind."},
  {"ref": "Matthew 22:39", "text": "And the second is like unto it, Thou shalt love thy neighbour as thyself."},
  {"ref": "Matthew 28:20", "text": "Teaching them to observe all things whatsoever I have commanded you: and, lo, I am with you alway, even unto the end of the world. Amen."},
  {"ref": "Mark 10:27", "text": "And Jesus looking upon them saith, With men it is impossible, but not with God: for with God all things are possible."},
  {"ref": "Mark 11:24", "text": "Therefore I say unto you, What things soever ye desire, when ye pray, believe that ye receive them, and ye shall have them."},
  {"ref": "Luke 6:31", "text": "And as ye would that men should do to you, do ye also to them likewise."},
  {"ref": "Luke 6:38", "text": "Give, and it shall be given unto you; good measure, pressed down, and shaken together, and running over, shall men give into your bosom. For with the same measure that ye mete withal it shall be measured to you again."},
  {"ref": "Luke 12:6", "text": "Are not five sparrows sold for two farthings, and not one of them is forgotten before God?"},
  {"ref": "Luke 12:15", "text": "And he said unto them, Take heed, and beware of covetousness: for a man's life consisteth not in the abundance of the things which he possesseth."},
  {"ref": "John 3:16", "text": "For God so loved the world, that he gave his only begotten Son, that whosoever believeth in him should not perish, but have everlasting life."},
  {"ref": "John 8:12", "text": "Then spake Jesus again unto them, saying, I am the light of the world: he that followeth me shall not walk in darkness, but shall have the light of life."},
  {"ref": "John 10:11", "text": "I am the good shepherd: the good shepherd giveth his life for the sheep."},
  {"ref": "John 10:27", "text": "My sheep hear my voice, and I know them, and they follow me."},
  {"ref": "John 13:34", "text": "A new commandment I give unto you, That ye love one another; as I have loved you, that ye also love one another."},
  {"ref": "John 14:1", "text": "Let not your heart be troubled: ye believe in God, believe also in me."},
  {"ref": "John 14:6", "text": "Jesus saith unto him, I am the way, the truth, and the life: no man cometh unto the Father, but by me."},
  {"ref": "John 14:27", "text": "Peace I leave with you, my peace I give unto you: not as the world giveth, give I unto you. Let not your heart be troubled, neither let it be afraid."},
  {"ref": "John 15:5", "text": "I am the vine, ye are the branches: He that abideth in me, and I in him, the same bringeth forth much fruit: for without me ye can do nothing."},
  {"ref": "John 15:12", "text": "This is my commandment, That ye love one another, as I have loved you."},
  {"ref": "John 15:13", "text": "Greater love hath no man than this, that a man lay down his life for his friends."},
  {"ref": "John 16:33", "text": "These things I have spoken unto you, that in me ye might have peace. In the world ye shall have tribulation: but be of good cheer; I have overcome the world."},
  {"ref": "Acts 20:35", "text": "I have shewed you all things, how that so labouring ye ought to support the weak, and to remember the words of the Lord Jesus, how he said, It is more blessed to give than to receive."},
  {"ref": "Romans 5:8", "text": "But God commendeth his love toward us, in that, while we were yet sinners, Christ died for us."},
  {"ref": "Romans 8:28", "text": "And we know that all things work together for good to them that love God, to them who are the called according to his purpose."},
  {"ref": "Romans 8:31", "text": "What shall we then say to these things? If God be for us, who can be against us?"},
  {"ref": "Romans 10:13", "text": "For whosoever shall call upon the name of the Lord shall be saved."},
  {"ref": "Romans 12:2", "text": "And be not conformed to this world: but be ye transformed by the renewing of your mind, that ye may prove what is that good, and acceptable, and perfect, will of God."},
  {"ref": "Romans 12:12", "text": "Rejoicing in hope; patient in tribulation; continuing instant in prayer."},
  {"ref": "Romans 12:18", "text": "If it be possible, as much as lieth in you, live peaceably with all men."},
  {"ref": "Romans 15:13", "text": "Now the God of hope fill you with all joy and peace in believing, that ye may abound in hope, through the power of the Holy Ghost."},
  {"ref": "1 Corinthians 13:13", "text": "And now abideth faith, hope, charity, these three; but the greatest of these is charity."},
  {"ref": "1 Corinthians 15:58", "text": "Therefore, my beloved brethren, be ye stedfast, unmoveable, always abounding in the work of the Lord, forasmuch as ye know that your labour is not in vain in the Lord."},
  {"ref": "1 Corinthians 16:13", "text": "Watch ye, stand fast in the faith, quit you like men, be strong."},
  {"ref": "1 Corinthians 16:14", "text": "Let all your things be done with charity."},
  {"ref": "2 Corinthians 5:17", "text": "Therefore if any man be in Christ, he is a new creature: old things are passed away; behold, all things are become new."},
  {"ref": "2 Corinthians 9:7", "text": "Every man according as he purposeth in his heart, so let him give; not grudgingly, or of necessity: for God loveth a cheerful giver."},
  {"ref": "2 Corinthians 12:9", "text": "And he said unto me, My grace is sufficient for thee: for my strength is made perfect in weakness. Most gladly therefore will I rather glory in my infirmities, that the power of Christ may rest upon me."},
  {"ref": "Galatians 6:2", "text": "Bear ye one another's burdens, and so fulfil the law of Christ."},
  {"ref": "Galatians 6:9", "text": "And let us not be weary in well doing: for in due season we shall reap, if we faint not."},
  {"ref": "Ephesians 2:8", "text": "For by grace are ye saved through faith; and that not of yourselves: it is the gift of God."},
  {"ref": "Ephesians 4:32", "text": "And be ye kind one to another, tenderhearted, forgiving one another, even as God for Christ's sake hath forgiven you."},
  {"ref": "Philippians 4:4", "text": "Rejoice in the Lord alway: and again I say, Rejoice."},
  {"ref": "Philippians 4:6", "text": "Be careful for nothing; but in every thing by prayer and supplication with thanksgiving let your requests be made known unto God."},
  {"ref": "Philippians 4:7", "text": "And the peace of God, which passeth all understanding, shall keep your hearts and minds through Christ Jesus."},
  {"ref": "Philippians 4:13", "text": "I can do all things through Christ which strengtheneth me."},
  {"ref": "Philippians 4:19", "text": "But my God shall supply all your need according to his riches in glory by Christ Jesus."},
  {"ref": "Colossians 3:15", "text": "And let the peace of God rule in your hearts, to the which also ye are called in one body; and be ye thankful."},
  {"ref": "Colossians 3:23", "text": "And whatsoever ye do, do it heartily, as to the Lord, and not unto men."},
  {"ref": "1 Thessalonians 5:16", "text": "Rejoice evermore."},
  {"ref": "1 Thessalonians 5:17", "text": "Pray without ceasing."},
  {"ref": "1 Thessalonians 5:18", "text": "In every thing give thanks: for this is the will of God in Christ Jesus concerning you."},
  {"ref": "2 Thessalonians 3:3", "text": "But the Lord is faithful, who shall stablish you, and keep you from evil."},
  {"ref": "2 Timothy 1:7", "text": "For God hath not given us the spirit of fear; but of power, and of love, and of a sound mind."},
  {"ref": "Hebrews 4:16", "text": "Let us therefore come boldly unto the throne of grace, that we may obtain mercy, and find grace to help in time of need."},
  {"ref": "Hebrews 11:1", "text": "Now faith is the substance of things hoped for, the evidence of things not seen."},
  {"ref": "Hebrews 13:2", "text": "Be not forgetful to entertain strangers: for thereby some have entertained angels unawares."},
  {"ref": "Hebrews 13:5", "text": "Let your conversation be without covetousness; and be content with such things as ye have: for he hath said, I will never leave thee, nor forsake thee."},
  {"ref": "Hebrews 13:8", "text": "Jesus Christ the same yesterday, and to day, and for ever."},
  {"ref": "James 1:5", "text": "If any of you lack wisdom, let him ask of God, that giveth to all men liberally, and upbraideth not; and it shall be given him."},
  {"ref": "James 1:17", "text": "Every good gift and every perfect gift is from above, and cometh down from the Father of lights, with whom is no variableness, neither shadow of turning."},
  {"ref": "James 4:8", "text": "Draw nigh to God, and he will draw nigh to you. Cleanse your hands, ye sinners; and purify your hearts, ye double minded."},
  {"ref": "James 5:16", "text": "Confess your faults one to another, and pray one for another, that ye may be healed. The effectual fervent prayer of a righteous man availeth much."},
  {"ref": "1 Peter 4:8", "text": "And above all things have fervent charity among yourselves: for charity shall cover the multitude of sins."},
  {"ref": "1 Peter 5:7", "text": "Casting all your care upon him; for he careth for you."},
  {"ref": "1 John 4:8", "text": "He that loveth not knoweth not God; for God is love."},
  {"ref": "1 John 4:19", "text": "We love him, because he first loved us."},
  {"ref": "1 John 1:9", "text": "If we confess our sins, he is faithful and just to forgive us our sins, and to cleanse us from all unrighteousness."},
  {"ref": "Revelation 3:20", "text": "Behold, I stand at the door, and knock: if any man hear my voice, and open the door, I will come in to him, and will sup with him, and he with me."},
  {"ref": "Revelation 21:4", "text": "And God shall wipe away all tears from their eyes; and there shall be no more death, neither sorrow, nor crying, neither shall there be any more pain: for the former things are passed away."}
];

export const ALMANAC_TIPS = [
  {"months": [1], "body": "Plant bare-root fruit trees, roses and pecan trees now while they are dormant. Water them in well and keep the soil moist, not soggy, until they leaf out."},
  {"months": [1], "body": "January is a good month to order seeds and get your soil tested through Texas A&M AgriLife's soil lab, so you know what the garden really needs before spring."},
  {"months": [1], "body": "Set out short-day onion transplants in January or February. Onions like loose, well-drained soil and steady moisture."},
  {"months": [1], "body": "Check water troughs on freezing mornings and break the ice so livestock can drink. Cattle need plenty of water in cold weather too."},
  {"months": [1], "body": "Before a hard freeze, drip outdoor faucets, cover exposed pipes and bring in tender potted plants. Old sheets and blankets work well for covering garden beds."},
  {"months": [1], "body": "Bermuda grass is dormant this time of year, so leave it be. Save the fertilizer for after it greens up in spring."},
  {"months": [1], "body": "Prune dormant fruit trees and grapevines in the coldest part of winter, before buds start to swell."},
  {"months": [1], "body": "A ring around the moon is old porch-side lore for rain on the way. The forecast is more reliable, but the moon is prettier."},
  {"months": [1], "body": "Fill bird feeders and keep a shallow dish of fresh water out. Songbirds burn a lot of energy on cold nights."},
  {"months": [1], "body": "Firewood burns best when it has been split, stacked off the ground and covered on top for at least six months. Well-seasoned oak is hard to beat."},
  {"months": [2], "body": "Many East Texas gardeners plant Irish potatoes around the middle of February. Use certified seed potatoes and plant them in loose, well-drained soil."},
  {"months": [2], "body": "Late February is a good time to prune roses and cut back dormant perennials. Wait to trim anything that may still get hurt by a late freeze."},
  {"months": [2], "body": "Don't top your crape myrtles. Cutting them back to stubs makes weak growth. Just remove crossing branches and suckers."},
  {"months": [2], "body": "English peas, lettuce, spinach and radishes can go in the ground in February in East Texas. A late freeze can nip them, so keep a cover handy."},
  {"months": [2], "body": "Apply a pre-emergent herbicide to lawns in late February or early March to stop crabgrass and other summer weeds before they sprout. Follow the label carefully."},
  {"months": [2], "body": "Start tomato and pepper seeds indoors in February so the transplants are sturdy by the time the weather warms up."},
  {"months": [2], "body": "Mid-winter is a fine time to put up nest boxes for bluebirds. They often begin looking for homes in late winter."},
  {"months": [2], "body": "Watch your cattle's body condition during the coldest weeks. Cold weather burns more energy, and hay quality matters."},
  {"months": [2], "body": "Redbud and wild plum are among the first trees to bloom in East Texas. They usually show color in late February or March, depending on the weather."},
  {"months": [3], "body": "The average last freeze in much of East Texas comes around mid to late March. Keep a cover on hand, because a late frost can still surprise you."},
  {"months": [3], "body": "Set out tomato transplants in late March or early April once the soil has warmed and the freeze danger has passed. Plant them deep, up to their first set of leaves."},
  {"months": [3], "body": "Wait until Bermuda grass has fully greened up before you fertilize it. Feeding too early mostly feeds the weeds."},
  {"months": [3], "body": "Spring is the season for severe weather in East Texas. Take a minute to check your weather radio batteries and decide where your family will shelter."},
  {"months": [3], "body": "Dogwoods, redbuds and azaleas put on quite a show in the piney woods in March and early April. Take a drive out to see them."},
  {"months": [3], "body": "Hummingbirds begin returning to East Texas in March and April. Clean your feeders and fill them with one part white sugar to four parts water. No dye needed."},
  {"months": [3], "body": "Start mowing your lawn when it starts growing. Never remove more than about a third of the leaf blade in one mowing."},
  {"months": [3], "body": "Sweet corn planted in March and early April has time to make before the summer heat sets in. Plant it in blocks, not one long row, to help pollination."},
  {"months": [3], "body": "Spring wildflowers such as phlox, Indian paintbrush and coreopsis start blooming along East Texas roadsides in spring. Let them set seed so they come back next year."},
  {"months": [4], "body": "Sweet potato slips can go into the garden in late April and May when the soil is warm. They love sandy East Texas soil."},
  {"months": [4], "body": "Fertilize Bermuda grass pastures and hayfields in spring once the grass has greened up and started to grow. A soil test will tell you what it needs."},
  {"months": [4], "body": "Fire ant bait works best when applied to ants that are actively foraging. Spread it on a dry day when no rain is coming for a day or two, and follow the label."},
  {"months": [4], "body": "Set out peppers, okra and eggplant once nights stay warm. They sulk in cool soil."},
  {"months": [4], "body": "April is a good time to plant squash and cucumbers. Scout for squash bugs early and check the undersides of the leaves."},
  {"months": [4], "body": "Mulch garden beds with two to three inches of straw, leaves or pine bark. It holds moisture and keeps weeds down before summer heat arrives."},
  {"months": [4], "body": "Watch for spring storms. Severe weather season in East Texas runs strongest in spring, so keep a weather radio on and a plan in mind."},
  {"months": [4], "body": "Cattle that move onto lush spring grass may need extra magnesium and mineral. Ask your vet or county extension agent what your herd needs."},
  {"months": [4], "body": "Dewberries begin ripening in late April and May. They love roadside ditches, and so do the chiggers, so dress accordingly."},
  {"months": [5], "body": "Purple hull peas and other southern peas go in when the soil is warm, from May into early summer. They thrive in East Texas heat."},
  {"months": [5], "body": "Wild blackberries and dewberries ripen in May and June. Pick them in the morning and enjoy them soon, because they do not keep."},
  {"months": [5], "body": "Keep an eye on hay meadows. Cut hay when the weather forecast gives you several dry days in a row."},
  {"months": [5], "body": "Water the garden deeply once or twice a week rather than a little every day. Deep watering encourages deeper roots."},
  {"months": [5], "body": "Tomatoes usually stop setting fruit when daytime highs stay in the mid-90s and nights stay warm. Keep them watered and wait for cooler nights in fall."},
  {"months": [5], "body": "Mayhaws and blackberries begin to ripen in East Texas in May. Jam and jelly time is right around the corner."},
  {"months": [5], "body": "Water your pond and pasture livestock daily. Make sure there is shade, clean water and mineral available as the days heat up."},
  {"months": [5], "body": "Mulch, water and stay with it. May is a good month to sow okra, southern peas and sweet potatoes for late summer eating."},
  {"months": [5], "body": "Before it gets hot, check your fence lines and gates. Cattle notice loose wire before you do."},
  {"months": [6], "body": "Water early in the morning. Watering when it's hot wastes water, and watering late in the evening can invite disease."},
  {"months": [6], "body": "Bermuda grass hay can be cut roughly every four to five weeks in the growing season with good moisture and fertility. Bale it dry to prevent mold and heating."},
  {"months": [6], "body": "Hot weather hits livestock hard. Make sure animals have shade, clean cool water and a break from work in the afternoon."},
  {"months": [6], "body": "Never leave children or pets in a parked car, even for a few minutes. The inside of a vehicle heats up dangerously fast in East Texas summers."},
  {"months": [6], "body": "Dump standing water from buckets, flower pot saucers and old tires once a week. It breaks the mosquito cycle before the eggs can hatch."},
  {"months": [6], "body": "Blueberries ripen in June. East Texas acidic soils suit them well, and they need steady moisture while the fruit is filling."},
  {"months": [6], "body": "Pick okra, squash and cucumbers often. Leaving big ones on the plant tells it to stop producing."},
  {"months": [6], "body": "Hurricane season runs June through November. Even inland East Texas can see heavy rain and wind from Gulf storms, so keep supplies stocked."},
  {"months": [6], "body": "If a lawn browns in patches during hot, dry weather, check the cause before treating. Chinch bugs, drought and disease can all look alike, especially on St. Augustine grass."},
  {"months": [7], "body": "July is a good time to start planning your fall garden. Decide where the tomatoes, broccoli and greens will go."},
  {"months": [7], "body": "Watch ponds for fish gasping at the surface in the early morning. That can mean low oxygen after hot, still, cloudy weather."},
  {"months": [7], "body": "Pick tomatoes as they blush and let them ripen indoors. Fruit ripened on a sunny windowsill tastes better than fruit split by a summer rain."},
  {"months": [7], "body": "Water deeply and mulch heavily during July and August. Shallow watering encourages shallow roots that suffer in the heat."},
  {"months": [7], "body": "Drink plenty of water when working outside. The heat index in East Texas can be hard on a body, and the first sign is often a headache."},
  {"months": [7], "body": "Mow Bermuda lawns regularly and keep them fairly short. St. Augustine grass does better when mowed taller, so raise the mower deck in summer heat."},
  {"months": [7], "body": "Check pastures for weeds and overgrazing. Resting a pasture in the heat helps grass recover."},
  {"months": [7], "body": "Keep an eye out for snakes when working in tall grass, woodpiles and barns. Wear boots and use a stick before reaching into dark spaces."},
  {"months": [7], "body": "Crape myrtles bloom through the heat of summer, and they don't mind it a bit. Deadhead spent flower clusters for a second flush of bloom."},
  {"months": [8], "body": "Set out transplants of fall tomatoes in early to mid August. Choose varieties that ripen quickly and give them plenty of water."},
  {"months": [8], "body": "August is the time to think about fall garden beds. Turn the soil, add compost and get ready for broccoli, cabbage and collards."},
  {"months": [8], "body": "Muscadines ripen in late summer and early fall in East Texas. Wild ones make good jelly."},
  {"months": [8], "body": "Hummingbirds gather at feeders in late summer before they head south. Keep feeders clean and full through September."},
  {"months": [8], "body": "Scout Bermuda pastures for armyworms in late summer, especially after rain. They can strip a field in a few days."},
  {"months": [8], "body": "Fall webworm nests show up on pecans, persimmons and other trees in late summer. Prune out small nests or knock them out with a pole."},
  {"months": [8], "body": "Keep an eye on livestock water quality in August. A dirty tank can make animals sick quickly in the heat."},
  {"months": [8], "body": "Don't fertilize your lawn in the hottest part of the summer. Wait for cooler weather in September."},
  {"months": [8], "body": "Pick tomatoes early in the morning before the heat. Warm fruit spoils faster."},
  {"months": [9], "body": "September is the time to set out broccoli, cabbage, cauliflower and collard transplants for a fall garden."},
  {"months": [9], "body": "Sow turnip and mustard greens seed in September and October. They grow fast in the mild fall weather."},
  {"months": [9], "body": "Apply pre-emergent herbicide in September or early October to stop winter weeds in lawns before they start."},
  {"months": [9], "body": "Overseed pastures with clover and ryegrass in fall for winter grazing. Ask your county agent which varieties suit your soil."},
  {"months": [9], "body": "Cooler nights mean the fall garden can take off. Water deeply, weed often and mulch to hold in moisture."},
  {"months": [9], "body": "Check your hay supply now. A good stack in September beats a costly scramble in January."},
  {"months": [9], "body": "Watch for the first hint of fall color in sweetgum, sumac and dogwood leaves. In East Texas it usually comes in late October and November."},
  {"months": [9], "body": "Hummingbirds pass through in September on their way south. Leave feeders up for a couple of weeks after you see the last one."},
  {"months": [9], "body": "Sow cool-season wildflower seed such as bluebonnets in fall so they can establish before winter."},
  {"months": [9], "body": "Dove season opens in September in Texas. Check Texas Parks and Wildlife for this year's dates, bag limits and license rules."},
  {"months": [9], "body": "Fire ants are very active in fall. Bait when the ants are foraging, the soil is dry, and no rain is expected."},
  {"months": [10], "body": "Pecans begin to drop in October and November. Gather them often, before squirrels and rain get them."},
  {"months": [10], "body": "October and November are good months to plant garlic. Daffodil bulbs go in the ground in the fall too."},
  {"months": [10], "body": "Monarch butterflies pass through Texas on their way to Mexico in the fall, mostly in October. Plants like goldenrod and asters give them something to feed on."},
  {"months": [10], "body": "Wild persimmons ripen in the fall and are best after they turn soft and wrinkled. Unripe persimmons are very astringent and will pucker your mouth."},
  {"months": [10], "body": "Sweet potatoes should be dug before the first hard freeze. Cure them in a warm, humid spot for a week or two before storing."},
  {"months": [10], "body": "Fall is a good time to plant trees. The soil is still warm and the roots have time to settle in before spring."},
  {"months": [10], "body": "Goldenrod blooms across East Texas pastures and roadsides in the fall. It is usually blamed for hay fever, but ragweed is the more common culprit."},
  {"months": [10], "body": "Rake fallen leaves onto garden beds or into the compost pile. Leaves make great free mulch."},
  {"months": [10], "body": "Have your chimney checked before lighting the first fire of the season."},
  {"months": [10], "body": "Fall is a good time to take a soil sample to the county extension office, so you know what your lawn and garden need before spring."},
  {"months": [11], "body": "The average first freeze in East Texas often arrives around mid-November, though it can come earlier or later. Watch the forecast and be ready to cover tender plants."},
  {"months": [11], "body": "Texas deer season traditionally opens in early November. Check Texas Parks and Wildlife for this year's dates and county regulations before heading out."},
  {"months": [11], "body": "Plant garlic and daffodil bulbs in November. Both like well-drained soil and will reward you in spring."},
  {"months": [11], "body": "Frost-killed sorghum and Johnsongrass can hold toxic prussic acid. Keep livestock off them for at least a week after a killing frost."},
  {"months": [11], "body": "Cool-season pastures of ryegrass and clover start to grow in November. Wait until they are well established before grazing heavily."},
  {"months": [11], "body": "Bring in tender potted plants before the first hard freeze. Citrus, ferns and tropical plants don't tolerate frost."},
  {"months": [11], "body": "November is a good time to plant trees and shrubs. The cool weather helps roots settle without summer heat stress."},
  {"months": [11], "body": "Collards, kale and turnip greens often taste sweeter after a light frost."},
  {"months": [11], "body": "When the clocks change, swap the batteries in your smoke alarms."},
  {"months": [12], "body": "December is a good time to plant pecans and other dormant trees. Water them well the first year."},
  {"months": [12], "body": "Water your winter garden only when the soil is dry, and cover tender crops when a hard freeze is forecast."},
  {"months": [12], "body": "Check livestock water troughs on freezing mornings. Break the ice so animals can drink."},
  {"months": [12], "body": "Keep poinsettias in bright light and away from cold drafts. Water them when the soil surface feels dry."},
  {"months": [12], "body": "Firewood is best when stacked off the ground and covered on top, with the sides open to the air."},
  {"months": [12], "body": "Never leave a fire, space heater or candles unattended, and check smoke alarms before the holidays."},
  {"months": [12], "body": "Winter is the time to service the mower and tractor, sharpen blades and change the oil, so you're ready come spring."},
  {"months": [12], "body": "\"Red sky at night, shepherd's delight; red sky at morning, shepherd take warning.\" It's fun old weather lore, not a forecast."},
  {"months": [12], "body": "Feed the birds through the winter, and keep water available. Cardinals, wrens and chickadees will thank you."},
  {"months": [12], "body": "Plan next year's garden on paper while it's cold. Rotate crops so tomatoes don't go in the same spot as last year."},
  {"months": [3, 4, 5], "body": "Mockingbirds and cardinals begin nesting in spring. Leave hedges alone until the nestlings have flown when you can."},
  {"months": [4, 5, 6], "body": "Chiggers and ticks are active in warm weather. Use repellent, tuck pants into boots and check yourself after time in tall grass."},
  {"months": [6, 7, 8], "body": "Bermuda grass thrives in summer heat, but it still needs about an inch of water a week. Water deeply, not often."},
  {"months": [6, 7, 8, 9], "body": "Fire ants build mounds after rain. Treat individual mounds or broadcast bait on a dry day, and always follow label directions."},
  {"months": [5, 6, 7, 8, 9], "body": "Pond edges grow willows and cattails quickly. Keep a grassy buffer around your pond to slow runoff and keep the water cleaner."},
  {"months": [1, 2, 3, 11, 12], "body": "Late fall through winter is a fine time to prune dormant trees. Skip heavy cutting on spring bloomers until after they flower."},
  {"months": [10, 11, 12, 1, 2], "body": "Calving and lambing seasons need extra checks. Keep a clean, dry, wind-sheltered spot handy for newborns."},
  {"months": [9, 10, 11, 12, 1, 2, 3], "body": "Chickens slow down laying as the days get shorter. Keep the coop dry and out of drafts, and give them fresh water."},
  {"months": [2, 3, 4, 9, 10, 11], "body": "The county extension office in Athens can help with soil tests, pasture questions and garden problems. Call Henderson County's AgriLife Extension office for local advice."}
];

export const JOKES = [
  "A Texan was visiting a farm in Vermont. He told the farmer, \"Back home, I can get in my truck at sunrise, drive all day, and still not reach the end of my ranch.\" The Vermont farmer nodded and said, \"Yep. I had a truck like that once.\"",
  "The preacher announced, \"Next Sunday I'm preaching on lying. To prepare, please read Mark chapter 17.\" The next week he asked, \"How many of you read Mark 17?\" Nearly every hand went up. The preacher smiled and said, \"Mark only has sixteen chapters. Now let's talk about lying.\"",
  "A doctor told an old farmer to walk two miles every day for his health. A month later the farmer called and said, \"Doc, I'm sixty miles from home. Now what?\"",
  "The farmer told the banker, \"I'd like a loan for a new tractor.\" The banker asked, \"What have you got for collateral?\" The farmer said, \"Two hundred acres and a real good dog.\" The banker said, \"We'll take the land.\" The farmer said, \"That dog isn't going to like it.\"",
  "A farmer kept praying, \"Lord, give me a bumper crop this year.\" Finally the Lord answered, \"I'd be glad to. But you're going to have to plant something.\"",
  "Our neighbor says he doesn't gossip. He just shares prayer requests with extra details.",
  "Our pastor prays a little longer over the potluck when he can't identify the casserole.",
  "The Sunday school teacher asked, \"Class, what do you do when you find a lost sheep?\" Little Sam said, \"First I ask if it wants to come back.\"",
  "A little girl was saying her bedtime prayers. \"God bless Mama, God bless Daddy, God bless Grandma. And God, please take good care of Yourself, because if anything happens to You, we're all in big trouble.\"",
  "It was so hot in July that the hens started laying hard-boiled eggs, and the farmer didn't have to fry a thing at breakfast.",
  "The preacher was in the middle of a long sermon when he noticed Brother Earl asleep in the third pew. He said to the man beside him, \"Would you wake Earl up, please?\" The man said, \"Pastor, you put him to sleep. You wake him up.\"",
  "At the church potluck, a visitor asked Miss Dorothy, \"Is this your famous banana pudding?\" She said, \"Honey, at this church every banana pudding is famous. The only question is whose.\"",
  "A boy was asked to say the blessing at Grandma's Thanksgiving dinner. He said, \"I don't know what to say.\" His mother whispered, \"Just say what you hear Daddy say.\" So he bowed his head and prayed, \"Lord, why on earth did I invite all these people to dinner?\"",
  "A city fellow stopped at a farm and asked, \"How do you tell the chickens from the roosters?\" The farmer said, \"Well, the ones that lay eggs are the chickens.\" The city fellow said, \"And the roosters?\" The farmer said, \"They just take credit for it.\"",
  "Grandma said the secret to her biscuits was love. Grandpa said the secret was that nobody had ever been brave enough to ask for a second one.",
  "Two farmers were leaning on the fence watching the rain finally come down after a month of drought. One said, \"Isn't that beautiful?\" The other said, \"Sure is. Now let's see how long it takes us to start complaining about the mud.\"",
  "I asked the old rancher how big his herd was. He said, \"Well, I'm not sure. Every time I count them, the count changes.\" I said, \"That's strange.\" He said, \"Not really. I keep falling asleep.\"",
  "A woman at church said, \"My husband and I have been married forty-five years and we've never had a cross word.\" Her friend said, \"Never?\" She said, \"Not out loud.\"",
  "An East Texas farmer had a mule that kicked. His neighbor asked, \"How do you get along with him?\" The farmer said, \"We have an understanding. He does the kicking, and I do the staying out of range.\"",
  "A country boy came home from his first day of school and told his mother, \"Teacher says I'm ahead of all the other kids.\" His mother said, \"That's wonderful!\" He said, \"Yes, ma'am. She told me to sit in the front row.\"",
  "My uncle Roy says he doesn't worry about a thing. His wife handles the worrying, the driving, the bills, and the directions. He handles the shade.",
  "The county agent asked the old farmer, \"Would you like to see the latest planting techniques?\" The farmer said, \"No thanks. I'm not farming half as well as I know how already.\"",
  "A rancher's wife asked, \"Why do you keep that old truck when it doesn't run?\" He said, \"It still runs. It just doesn't like to.\"",
  "A man asked his neighbor why he was standing in the pasture staring at the cows. The neighbor said, \"I'm supervising.\" The man said, \"And how are they doing?\" The neighbor said, \"They've done all their work, and I've done all mine, and we're both very happy.\"",
  "A farmer went to the doctor. The doctor said, \"You need to slow down.\" The farmer said, \"I only have two speeds, Doc. Asleep and hay season.\"",
  "Grandpa's rule for fishing: If you catch one, keep it. If you catch two, tell somebody. If you catch three, tell everybody. If you catch none, blame the moon.",
  "A fella walked into a diner in Tyler and ordered a large sweet tea. The waitress asked, \"Would you like some tea with your sugar?\"",
  "Two boys were bragging. One said, \"My daddy's a Baptist preacher and he knows everything.\" The other said, \"My daddy's a Methodist preacher and he knows even more.\" A third boy said, \"My daddy's a farmer, and when he doesn't know something, he says it's going to rain.\"",
  "Aunt Bertha never wastes a thing. When the church ran out of cake, she cut the leftover fruitcake in half and called it two desserts.",
  "The old farmer was asked what he thought about all the new gadgets. He said, \"I like them fine. But the day my tractor starts asking me questions, I'm going back to the mule.\"",
  "A hound dog walked into a Baptist church, looked around, and walked right out. The preacher asked, \"Was it something I said?\" The deacon said, \"No, Pastor. He was just checking to see if there was any leftover chicken.\"",
  "I told my wife I was going to take up gardening. She said, \"That's wonderful.\" Then I bought two hundred dollars of seed, a tiller, and a fence. We'll be eating tomatoes by Christmas at about eleven dollars each.",
  "Last year I grew one zucchini. This year I'm hiding from the neighbors who heard about it.",
  "An old farmer was asked why he never wears a watch. He said, \"I don't need one. The cows tell me when it's milking time, the sun tells me when it's noon, and my wife tells me everything else.\"",
  "At the church picnic, someone asked Grandpa Joe why he was hiding behind the pie table. He said, \"Two ladies are arguing about whose recipe is best, and I'm not ready to have an opinion.\"",
  "Our neighbor keeps a sign on his gate: \"Beware of dog.\" The dog keeps a sign on the porch: \"Beware of neighbor.\"",
  "An old-timer told me the secret to a happy life: \"Never take advice from anyone who doesn't have mud on their boots.\"",
  "A fellow told the auctioneer, \"I'd like to buy that calf.\" The auctioneer said, \"Sold!\" The fellow said, \"How much?\" The auctioneer said, \"Depends. Did you blink?\"",
  "The old man on the porch said, \"I've seen a lot of changes in my day, and I've been against every one of them.\"",
  "My granddaddy could fix anything with baling wire, duct tape, and a stern talking-to. The stern talking-to worked best on the neighbors.",
  "The old farmer was asked to describe his best year. He said, \"It rained when we needed it, the price was good, and my wife didn't ask about the new tractor.\" The reporter asked, \"Which year was that?\" He said, \"I'm still hoping for it.\"",
  "A little boy told his grandma he wanted to be a farmer when he grew up. She said, \"That's wonderful. What kind?\" He said, \"The kind who gets to ride the tractor and never has to plant anything.\"",
  "A tourist asked a farmer near Athens, \"What time does the next bus come through?\" The farmer said, \"Which one? The one that's late, or the one that's really late?\"",
  "The fisherman told the game warden, \"I've been sitting here since sunrise and haven't caught a thing.\" The game warden said, \"Have you tried a hook?\" The fisherman said, \"Sir, I'm trying to enjoy myself.\"",
  "A man asked an East Texan for directions. The East Texan said, \"Go down the road till you see where the old barn used to be. Turn right. Then go till you see where the church used to be. If you get to the new Dollar General, you've gone too far.\"",
  "Winter in East Texas: Monday I wore a coat. Tuesday, a sweater. Wednesday, shorts. Thursday I put the coat back on, and the air conditioner never stopped running.",
  "The old-timer said, \"If you don't like the weather in East Texas, wait five minutes.\" Then he added, \"And if you do like it, wait five minutes.\"",
  "Uncle Bud's tractor runs on diesel and prayer. Diesel got expensive, so now it mostly runs on prayer.",
  "Grandpa's gardening advice: \"Plant the seed, pray for rain, and be modest about the yield.\"",
  "Johnny's teacher said, \"I ain't got no pencil. Now Johnny, say it right: I don't have a pencil. You don't have a pencil. They don't have a pencil.\" Johnny said, \"Well, who took all the pencils?\"",
  "The teacher said, \"Why are you late again, Billy?\" Billy said, \"The sign on the road said 'School Ahead, Go Slow.'\"",
  "The teacher said, \"Johnny, why didn't you do your homework?\" Johnny said, \"The pig ate it.\" The teacher said, \"You don't have a pig.\" Johnny said, \"That's why he was so hungry.\"",
  "Miss Betty's church hat is so big it has its own zip code.",
  "Grandma's sweet tea is so sweet the dentist sends her a Christmas card.",
  "Grandma's recipe says, \"Add flour until it looks right.\" Nobody in the family has ever seen it look right, but it always tastes right.",
  "The pastor asked Brother Tom to pray for rain. It rained eight days straight. Now the pastor wants him to pray for it to stop, and Tom says, \"Let's not push our luck.\"",
  "At our church, \"In closing\" is a promise nobody has ever been able to check.",
  "The fire ants came to the church picnic. They never wait for the blessing.",
  "East Texas mosquitoes are so big that when one landed on the porch, Grandpa asked if it was staying for supper.",
  "Hay season is the only time a man can be tired, sunburned, and itchy, and still say, \"Let's do one more load.\"",
  "Back home our sweet potatoes get so big we have to serve them with a forklift.",
  "It rained so hard last week the ducks were asking for umbrellas.",
  "It was so hot in July that I saw a dog chasing a cat, and both of them were walking.",
  "Texas has four seasons: almost summer, summer, still summer, and Christmas.",
  "Our town is so small that the welcome sign and the goodbye sign are the same sign.",
  "Rush hour in our town is three pickups, a tractor, and somebody waving from every one of them.",
  "In our small town, the phone tree is faster than the internet. Sneeze at nine o'clock and there's a get-well casserole on your porch by ten.",
  "I asked the man at the roadside stand if the peaches were fresh. He said, \"Picked this morning.\" I said, \"Which morning?\"",
  "The sign at the roadside stand said, \"Honor system. Also, my cousin is watching.\"",
  "The sign on the farm gate said, \"Beware of the goose. The dog is friendly.\"",
  "My dog is a fine guard dog. He watches the mailman with great interest and total support.",
  "Our barn cat has one job, which is sitting. She's been employee of the month for six years.",
  "My mule is so stubborn that when I said go left, he went right, and when I said go right, he stood there enjoying my company.",
  "My truck has more rust than a barbed wire fence, but the rust is holding the parts together.",
  "I told my wife I'd fix the fence \"this weekend.\" She asked, \"Which weekend?\" I said, \"Now that's a fair question.\"",
  "A horse walked into the feed store. The clerk said, \"Why the long face?\"",
  "Why did the farmer name his hog Ink? Because it kept running out of the pen.",
  "What is a pig's favorite ballet? Swine Lake.",
  "The cook at the ranch said, \"I put a little of everything in this stew.\" One cowboy put down his spoon and said, \"That's what I was afraid of.\"",
  "A farmer was asked for the secret to a good crop. He said, \"Rain in April, sun in June, and a neighbor who returns the tools he borrows.\" The reporter said, \"And which of those is hardest to come by?\"",
  "An old rancher said the best cure for worry is a long fence-line walk. \"By the time you get to the end, you've forgotten what you were worried about. And you've usually found what needs fixing.\""
];

/* ---------------------------------------------------------------------------------------------
 * Deterministic pickers (pure functions; no network, no AI).
 * ------------------------------------------------------------------------------------------- */

const norm = (s) => String(s || "").toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();

/** Whole days since 2026-01-01 for a Chicago calendar date given as {y, m, d} (strings or numbers). */
export function dayNumber({ y, m, d }) {
  return Math.floor((Date.UTC(Number(y), Number(m) - 1, Number(d)) - Date.UTC(2026, 0, 1)) / 86400000);
}

/** Small seeded PRNG so the (fixed) shuffle of SCRIPTURES is identical on every run. */
function mulberry32(a) {
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** SCRIPTURES in a fixed, mixed-up order (Psalms/Proverbs/Gospels/etc. interleaved). */
export const SCRIPTURE_ORDER = (() => {
  const arr = SCRIPTURES.slice();
  const rnd = mulberry32(20260930);
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(rnd() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
})();

export function scriptureBody(s) {
  return s.text + " — " + s.ref + " (KJV)";
}

/**
 * Same verse never repeats until all SCRIPTURES are used (index = day number mod length).
 * `prevText` = yesterday's stored scripture body (any format); a match is skipped.
 */
export function pickScripture(parts, prevText) {
  const n = SCRIPTURE_ORDER.length;
  const start = ((dayNumber(parts) % n) + n) % n;
  const prev = norm(prevText);
  for (let k = 0; k < n; k++) {
    const s = SCRIPTURE_ORDER[(start + k) % n];
    if (prev && (norm(scriptureBody(s)) === prev || prev.includes(norm(s.text)) || (" " + prev + " ").includes(" " + norm(s.ref) + " "))) continue;
    return s;
  }
  return SCRIPTURE_ORDER[start];
}

/** Almanac tip for the Chicago month, rotating by day; skips yesterday's stored tip. */
export function pickAlmanac(parts, prevText) {
  const month = Number(parts.m);
  const pool = ALMANAC_TIPS.filter((t) => t.months.includes(month));
  const list = pool.length ? pool : ALMANAC_TIPS;
  const n = list.length;
  const start = ((dayNumber(parts) % n) + n) % n;
  const prev = norm(prevText);
  for (let k = 0; k < n; k++) {
    const t = list[(start + k) % n];
    if (prev && norm(t.body) === prev) continue;
    return t;
  }
  return list[start];
}

/**
 * Curated joke with no repeat until the list is exhausted. `avoid` = recent jokes (newest first);
 * `isOk(joke)` = extra filter (banned patterns). Picks the first joke in list order that is not in
 * `avoid`, so the 12 best go first; if every joke was recently used, picks the least recently used.
 */
export function pickJoke(avoid, isOk) {
  const ok = typeof isOk === "function" ? isOk : () => true;
  const recent = (avoid || []).map(norm);
  const clean = JOKES.filter((j) => ok(j));
  if (!clean.length) return null;
  const fresh = clean.filter((j) => !recent.includes(norm(j)));
  if (fresh.length) return fresh[0];
  // exhausted: choose the one used longest ago (largest index in newest-first list)
  let best = clean[0];
  let bestIdx = -1;
  for (const j of clean) {
    const idx = recent.indexOf(norm(j));
    if (idx > bestIdx) {
      bestIdx = idx;
      best = j;
    }
  }
  return best;
}
