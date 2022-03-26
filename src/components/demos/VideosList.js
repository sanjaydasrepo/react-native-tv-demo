import React, {useEffect, useRef} from 'react';
import {
  StyleSheet,
  View,
  ScrollView,
  SectionList,
  Text,
  Platform,
  findNodeHandle,
  ImageBackground,
} from 'react-native';
import Style from '../../styles/Style';
import {maxStrLength, youtube_parser} from '../../utils/helper';
import FocusableHighlight from '../focusable/FocusableHighlight';

const SECTIONS = 15;
const SECTIONS_ROWS = 1;
const ITEMS = 15;

const baseUrl = 'https://inssports.live/api';

const sectionsList = [
  // {
  //   section: 'live',
  //   url: `${baseUrl}/getVideosBySections?count=5&page=1&section=live`,
  // },
  // {
  //   section: 'upcoming',
  //   url: `${baseUrl}/getVideosBySections?count=5&page=1&section=upcoming`,
  // },
  // {
  //   section: 'current',
  //   url: `${baseUrl}/getVideosBySections?count=5&page=1&section=current`,
  // },
  {
    section: 'banner',
    url: `${baseUrl}/getVideosBySections?count=5&page=1&section=banner`,
  },
  // {
  //   section: 'topSports',
  //   url: `${baseUrl}/getFilteredSports`,
  // },
  // {
  //   section: 'special',
  //   url: `${baseUrl}/getVideosBySections?count=5&page=1&section=special`,
  // },
  {
    section: 'headline',
    url: `${baseUrl}/getVideosBySections?count=5&page=1&section=headline`,
  },

  // {
  //   section: "headline",
  //   url: `${baseUrl}/getVideosBySections?count=5&page=1&section=headline`
  // },
  // {
  //   section: "biography",
  //   url: `${baseUrl}/getVideosBySections?count=5&page=1&section=biography`
  // },
  {
    section: 'promo',
    url: `${baseUrl}/getVideosBySections?count=5&page=1&section=promo`,
  },
  // {
  //   section: "tip",
  //   url: `${baseUrl}/getVideosBySections?count=5&page=1&section=tip`
  // },
  // {
  //   section: "allTeams",
  //   url: `${baseUrl}/getAllTeams`
  // },
  // {
  //   section: "allSports",
  //   url: `${baseUrl}/getAllSports`
  // },
  {
    section: 'interview',
    url: `${baseUrl}/getVideosBySections?count=5&page=1&section=interview`,
  },
  // {
  //   section: "latestUpdate",
  //   url: `${baseUrl}/getVideosBySections?count=5&page=1&section=latestUpdate`
  // },
];

const DATA = [
  {
    title: 'Main dishes',
    data: ['Pizza', 'Burger', 'Risotto'],
  },
  {
    title: 'Sides',
    data: ['French Fries', 'Onion Rings', 'Fried Shrimps'],
  },
  {
    title: 'Drinks',
    data: ['Water', 'Coke', 'Beer'],
  },
  {
    title: 'Desserts',
    data: ['Cheese Cake', 'Ice Cream'],
  },
];

const VideosList = () => {
  const sectionListRef = useRef(null);
  const rowRefs = useRef([]);
  const [videos, setVideos] = React.useState([]);
  const [loading, setLoading] = React.useState(false);

  function onItemFocus(e, section, row, item) {
    if (!rowRefs.current) {
      return;
    }
    if (section >= 0 && section < rowRefs.current.length) {
      // Check refs
      const rowRef = rowRefs.current[section];
      if (!rowRef || !sectionListRef) {
        return;
      }
      // Get styles
      const rowsStyle = StyleSheet.flatten(styles.rows);
      const rowItemStyle = StyleSheet.flatten(styles.rowItem);
      const sectionHeader = StyleSheet.flatten(styles.sectionHeader);
      // Get rows width / height
      const rowsWidth = rowsStyle.width;
      const rowsHeight = rowsStyle.height;
      // Get item width / height
      const itemWidth = rowItemStyle.width + rowItemStyle.margin * 2;
      const itemHeight =
        rowItemStyle.height +
        rowItemStyle.margin * 2 +
        sectionHeader.fontSize +
        sectionHeader.marginTop;
      // Get horizontal offset for current item in current row
      const itemLeftOffset = itemWidth * item;
      // Get vertical offset for current row in rows
      const itemTopOffset = itemHeight * section;
      // Center item horizontally in row
      const rowsWidthHalf = rowsWidth / 2;
      if (itemLeftOffset >= rowsWidthHalf) {
        const x = itemLeftOffset - rowsWidthHalf + itemWidth / 2;
        rowRef.scrollTo({x: x, animated: true});
      } else {
        rowRef.scrollTo({x: 0, animated: true});
      }
      // Scroll vertically to current row
      const rowsHeightHalf = rowsHeight / 2;
      if (itemTopOffset >= rowsHeightHalf - itemHeight) {
        sectionListRef.current.scrollToLocation({
          sectionIndex: section,
          itemIndex: 0,
          animated: true,
        });
      } else {
        sectionListRef.current.scrollToLocation({
          sectionIndex: 0,
          itemIndex: 0,
          animated: true,
        });
      }
    }
  }

  function showItems(section, row) {
    // const item = section.data[row];
    const items = section.data;
    // console.log('Key is ', item );

    return items.map((item) => {
      const key = 'sectionlist_item_' + '.' + row + '.' + item._id;

      console.log('Key is ', youtube_parser(item.videoUrl));

      return (
        <FocusableHighlight
          onPress={() => {}}
          onFocus={(e) => {
            // onItemFocus(e, section, row, item._id);
          }}
          underlayColor={Style.buttonFocusedColor}
          style={styles.rowItem}
          nativeID={key}
          stylePressed={{
            padding:8,
            backgroundColor:'tomato'
          }}
          key={key}>

          <>
          <ImageBackground
            source={{
              uri: `https://img.youtube.com/vi/${youtube_parser(item.videoUrl)}/mqdefault.jpg`,
            }}
            resizeMode="cover"
            style={{justifyContent: 'center', height:100,width:'100%'}}
          />
           <Text style={styles.text}>{maxStrLength(20, item?.title)}</Text>
          </>
        </FocusableHighlight>
      );
    });
  }
  function showRow(sectionItem) {
    const item = sectionItem.item;

    if (sectionItem.index !== 0) return null;
    console.log('item ---------> ', sectionItem);

    const key = 'sectionlist_row_' + item._id + sectionItem.index;

    return (
      <ScrollView
        ref={(ref) => {
          rowRefs.current[item.section] = ref;
          if (Platform.OS === 'web') {
            let node = findNodeHandle(ref);
            if (node) {
              // Set ScrollView spatial navigation action as focus to avoid scroll on up
              node.style.setProperty('--spatial-navigation-action', 'focus');
            }
          }
        }}
        style={styles.row}
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        nativeID={key}
        key={key}>
        {showItems(sectionItem.section, sectionItem.index)}
      </ScrollView>
    );
  }

  function renderSectionHeader(sectionHeader) {
    const section = sectionHeader.section;
    return <Text style={styles.sectionHeader}>{section.title}</Text>;
  }

  function getSections() {
    // Load data
    let vids = [];

    const promises = [];
    // dispatch(setGLoading(true));
    for (let i = 0; i < sectionsList.length; i++) {
      promises.push(fetch(sectionsList[i].url));
    }
    Promise.all(promises)
      .then(async (resolve) => {
        for (let i = 0; i < sectionsList.length; i++) {
          const result = await resolve[i].json();

          vids.push({
            title: sectionsList[i].section,
            data: result[sectionsList[i].section],
          });

          // dispatch(
          //   addSections({
          //     section: sections[i].section,
          //     data: result,
          //   }),
          // );
        }
        setVideos(vids);
        console.log('Once here ', vids);

        // setTimeout(() => {
        //   setLoading(false);
        // }, 1000);
      })
      .catch((error) => {
        console.error(error);
      });

    // for (let i = 0; i < sectionsList.length; i++) {
    //   let rows = [];
    //   for (let j = 0; j < SECTIONS_ROWS; j++) {
    //     rows.push({section: i, row: j});
    //   }
    //   sections.push({
    //     title: 'Section ' + (i + 1),
    //     data: rows,
    //   });
    // }
    // return sections;
  }

  useEffect(() => {
    try {
      getSections();
    } catch (error) {
      console.log('Error ', error);
    }
  }, []);

  const Item = ({title}) => (
    <View style={styles.item}>
      <Text style={styles.title}>{title.title}</Text>
    </View>
  );

  console.log('Viideos ', videos);

  // Render
  return (
    <View style={Style.styles.content}>
      <Text
        style={{
          fontSize: 24,
          fontWeight: 'bold',
          alignSelf: 'flex-start',
          padding: 8,
        }}>
        Videos
      </Text>
      {videos.length > 0 ? (
        <SectionList
          ref={sectionListRef}
          style={styles.rows}
          nativeID={'sectionlist'}
          sections={videos}
          renderItem={showRow}
          renderSectionHeader={renderSectionHeader}
          keyExtractor={(row, index) => index}
          showsVerticalScrollIndicator={false}
        />
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  rows: {
    width: Style.px(1520),
    height: Style.px(780),
    borderWidth: 1,
  },
  row: {
    width: '100%',
    height: Style.px(280),
  },
  rowItem: {
    width: Style.px(300),
    // height: Style.px(280),
    margin: Style.px(10),
    // backgroundColor: Style.buttonUnfocusedColor,
    flex: 1,
    justifyContent: 'center',
    // alignItems: 'center',
  },
  sectionHeader: {
    marginTop: Style.px(5),
    marginLeft: Style.px(10),
    color: '#FF6B6B',
    fontSize: Style.px(40),
    textTransform:'capitalize',
  },
  text: {
    fontSize: Style.px(24),
    color: '#000',
  },
});

export default VideosList;
