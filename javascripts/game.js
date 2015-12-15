$(function() {
  game.init_level('lobby');
  game.draw_level();
  game.start();
});


game = {

  container_handle: $('#game-container'),
  floormap_handle: $('#floormap'),
  itemmap_handle: $('#itemmap'),
  npcmap_handle: $('#npcsmap'),
  player_handle: $('#player'),
  level: null,
  real_map_width: null,
  real_map_height: null,
  move_increment: 320,

  init_level: function(level_name) {

    // init all the things
    this.container_handle         = $('#game-container');
    this.floormap_handle          = $('#floormap');
    this.player_handle            = $('#player');
    this.itemmap_handle           = $('#itemmap');
    this.npcmap_handle            = $('#npcmap');

    // set current level
    this.level = this.levels[level_name];

    // set real floormap width and height, and update DOM
    this.real_map_width = this.level.tile_diameter * this.level.cols;
    this.real_map_height = this.level.tile_diameter * this.level.rows;
    this.floormap_handle.css('width', this.real_map_width + 'px');
    this.floormap_handle.css('height', this.real_map_height + 'px');

    this.set_floor_position(this.level.start_position.x, this.level.start_position.y);
    this.player.location.x = this.level.start_position.x;
    this.player.location.y = this.level.start_position.y;

    this.center_player();

    this.pygmalionize_npcs();
  },

  start: function() {
    self = this;

    this.player.sprite.cycle_frames();

    $('body').on('keydown', function(k) {
      k.preventDefault();
      switch(k.which) {
        case self.keys.up:
          self.move_player('up');
          break;
        case self.keys.right:
          self.move_player('right');
          break;
        case self.keys.down:
          self.move_player('down');
          break;
        case self.keys.left:
          self.move_player('left');
          break;
        case self.keys.interact:
          console.log('interacting!');
          break;
      }
    });
  },

  move_player: function(direction) {
    self = this;

    switch(direction) {
      case 'up':
        self.player.sprite.img_path = 'images/sprites/player/walk_up.png';
        if (self.player.can_move('up')) {
          self.floormap_handle.filter(':not(:animated)').animate({
            top: '+=' + self.move_increment + 'px'
          }, self.player.gait_slowness, self.player.gait_animation_curve, function() { self.player.location.y--; });
        }
        break;
      case 'right':
        self.player.sprite.img_path = 'images/sprites/player/walk_right.png';
        if (self.player.can_move('right')) {
          self.floormap_handle.filter(':not(:animated)').animate({
            left: '-=' + self.move_increment + 'px'
          }, self.player.gait_slowness, self.player.gait_animation_curve, function() { self.player.location.x++; });
        }
        break;
      case 'down':
        self.player.sprite.img_path = 'images/sprites/player/walk_down.png';
        if (self.player.can_move('down')) {
          self.floormap_handle.filter(':not(:animated)').animate({
            top: '-=' + self.move_increment + 'px'
          }, self.player.gait_slowness, self.player.gait_animation_curve, function() { self.player.location.y++; });
        }
        break;
      case 'left':
        self.player.sprite.img_path = 'images/sprites/player/walk_left.png';
        if (self.player.can_move('left')) {
          self.floormap_handle.filter(':not(:animated)').animate({
            left: '+=' + self.move_increment + 'px'
          }, self.player.gait_slowness, self.player.gait_animation_curve, function() { self.player.location.x--; });
        }
        break;
    }
  },

  set_floor_position: function(x,y) {
    viewport_adjustment_x = (this.container_handle.width()  / 2) - (this.level.tile_diameter / 2);
    viewport_adjustment_y = (this.container_handle.height() / 2) - (this.level.tile_diameter / 2);
    new_x = -(x * this.level.tile_diameter) + viewport_adjustment_x;
    new_y = -(y * this.level.tile_diameter) + viewport_adjustment_y;
    this.floormap_handle.css('left', new_x + 'px');
    this.floormap_handle.css('top',  new_y + 'px');
  },

  draw_level: function() {
    for(n = 0; n < this.level.map.length; n++) {
      sprite_class = '';
      if (this.level.npcs[n] !== 'NIL') {
        sprite_class = 'npc ' + this.level.npcs[n];
      }
      this.floormap_handle.append('<div class="tile"><img src="images/' +  this.tile_types[this.level.map[n]].img_path    + '" /></div>');
      this.itemmap_handle.append( '<div class="tile"><img src="images/' +  this.item_types[this.level.items[n]].img_path  + '" /></div>');
      this.npcmap_handle.append(  '<div class="tile"><img class="' + sprite_class + '" src="images/' +  this.npc_types[this.level.npcs[n]].img_path    + '" /></div>');
    }
  },

  center_player: function() {
    viewport_relative_x = (this.container_handle.width()  / 2) - (this.player_handle.width()  / 2);
    viewport_relative_y = (this.container_handle.height() / 2) - (this.player_handle.height() / 2);
    this.player_handle.css('left', viewport_relative_x + 'px');
    this.player_handle.css('top',viewport_relative_y + 'px');
  },

  pygmalionize_npcs: function() {
    // TODO: make this work - animate all npcs
    tiles = this.npcmap_handle.find('div').toArray();
    $(tiles[0]).css('border','3px solid red');
    console.log(tiles);
  },

  // define all levels here
  levels: {
    lobby: {
      map: [
        'W00','W00','W00','W00','W00','W00','W00','W00','W00','W00','W00','W00','W00','W00','W00','W00','W00','W00','W00','W00','W00',
        'W00','F00','W00','F00','W00','F00','W00','F00','W00','F00','W00','F00','W00','F00','W00','F00','W00','F00','W00','F00','W00',
        'W00','F00','F00','F00','W00','F00','F00','F00','F00','F00','F00','F00','F00','F00','F00','F00','F00','F00','F00','F00','W00',
        'W00','W00','W00','F00','W00','F00','W00','F00','W00','F00','W00','F00','W00','F00','W00','F00','W00','F00','W00','F00','W00',
        'W00','F00','F00','F00','W00','F00','F00','F00','F00','F00','F00','F00','F00','F00','F00','F00','F00','F00','F00','F00','W00',
        'W00','F00','W00','F00','W00','F00','W00','F00','W00','F00','W00','F00','W00','F00','W00','F00','W00','F00','W00','F00','W00',
        'W00','F00','W00','F00','F00','F00','F00','F00','F00','F00','F00','F00','F00','F00','F00','F00','F00','F00','F00','F00','W00',
        'W00','F00','F00','F00','W00','F00','W00','F00','W00','F00','W00','F00','W00','F00','W00','F00','W00','F00','W00','F00','W00',
        'W00','W00','F00','W00','F00','F00','F00','F00','F00','F00','F00','F00','F00','F00','F00','F00','F00','F00','F00','F00','W00',
        'W00','F00','F00','F00','W00','F00','W00','F00','W00','F00','W00','F00','W00','F00','W00','F00','W00','F00','W00','F00','W00',
        'W00','F00','F00','F00','F00','F00','F00','F00','F00','F00','F00','F00','F00','F00','F00','F00','F00','F00','F00','F00','W00',
        'W00','F00','W00','F00','W00','F00','W00','F00','W00','F00','W00','F00','W00','F00','W00','F00','W00','F00','W00','F00','W00',
        'W00','F00','F00','F00','F00','F00','F00','F00','F00','F00','F00','F00','F00','F00','F00','F00','F00','F00','F00','F00','W00',
        'W00','F00','F00','F00','F00','F00','F00','F00','F00','F00','F00','F00','W00','F00','W00','F00','W00','F00','W00','F00','W00',
        'W00','F00','F00','F00','F00','F00','F00','F00','F00','F00','F00','F00','F00','F00','F00','F00','F00','F00','F00','F00','W00',
        'W00','F00','F00','F00','F00','F00','F00','F00','W00','W00','W00','F00','F00','F00','F00','F00','F00','F00','F00','F00','W00',
        'W00','F00','F00','F00','F00','F00','F00','F00','W00','F00','W00','F00','F00','F00','F00','F00','F00','F00','F00','F00','W00',
        'W00','F00','F00','F00','F00','F00','F00','F00','W00','F00','W00','F00','F00','F00','F00','F00','F00','F00','F00','F00','W00',
        'W00','F00','F00','F00','F00','F00','F00','F00','W00','F00','W00','F00','F00','F00','F00','F00','F00','F00','F00','F00','W00',
        'W00','F00','F00','F00','F00','F00','F00','F00','F00','F00','F00','F00','F00','F00','F00','F00','F00','F00','F00','F00','W00',
        'W00','W00','W00','W00','W00','W00','W00','W00','W00','W00','W00','W00','W00','W00','W00','W00','W00','W00','W00','W00','W00',
      ],
      items: [
        'NIL','NIL','NIL','NIL','NIL','NIL','NIL','NIL','NIL','NIL','NIL','NIL','NIL','NIL','NIL','NIL','NIL','NIL','NIL','NIL','NIL',
        'NIL','NIL','NIL','NIL','NIL','NIL','NIL','NIL','NIL','NIL','NIL','NIL','NIL','NIL','NIL','NIL','NIL','NIL','NIL','NIL','NIL',
        'NIL','NIL','NIL','NIL','NIL','NIL','NIL','NIL','NIL','NIL','NIL','NIL','NIL','NIL','NIL','NIL','NIL','NIL','NIL','NIL','NIL',
        'NIL','NIL','NIL','NIL','NIL','NIL','NIL','NIL','NIL','NIL','NIL','NIL','NIL','NIL','NIL','NIL','NIL','NIL','NIL','NIL','NIL',
        'NIL','NIL','NIL','NIL','NIL','NIL','NIL','NIL','NIL','NIL','NIL','NIL','NIL','NIL','NIL','NIL','NIL','NIL','NIL','NIL','NIL',
        'NIL','NIL','NIL','NIL','NIL','NIL','NIL','NIL','NIL','NIL','NIL','NIL','NIL','NIL','NIL','NIL','NIL','NIL','NIL','NIL','NIL',
        'NIL','NIL','NIL','NIL','NIL','NIL','NIL','NIL','NIL','NIL','NIL','NIL','NIL','NIL','NIL','NIL','NIL','NIL','NIL','NIL','NIL',
        'NIL','NIL','NIL','NIL','NIL','NIL','NIL','NIL','NIL','NIL','NIL','NIL','NIL','NIL','NIL','NIL','NIL','NIL','NIL','NIL','NIL',
        'NIL','NIL','NIL','NIL','NIL','NIL','NIL','NIL','NIL','NIL','NIL','NIL','NIL','NIL','NIL','NIL','NIL','NIL','NIL','NIL','NIL',
        'NIL','NIL','NIL','NIL','NIL','NIL','NIL','NIL','NIL','NIL','NIL','NIL','NIL','NIL','NIL','NIL','NIL','NIL','NIL','NIL','NIL',
        'NIL','NIL','NIL','NIL','NIL','NIL','NIL','NIL','NIL','NIL','NIL','NIL','NIL','NIL','NIL','NIL','NIL','NIL','NIL','NIL','NIL',
        'NIL','NIL','NIL','NIL','NIL','NIL','NIL','NIL','NIL','NIL','NIL','NIL','NIL','NIL','NIL','NIL','NIL','NIL','NIL','NIL','NIL',
        'NIL','NIL','NIL','NIL','NIL','NIL','NIL','NIL','NIL','NIL','NIL','NIL','NIL','NIL','NIL','NIL','NIL','NIL','NIL','NIL','NIL',
        'NIL','NIL','NIL','NIL','NIL','NIL','NIL','NIL','NIL','NIL','NIL','NIL','NIL','NIL','NIL','NIL','NIL','NIL','NIL','NIL','NIL',
        'NIL','NIL','NIL','NIL','NIL','NIL','NIL','NIL','NIL','NIL','NIL','NIL','NIL','NIL','NIL','NIL','NIL','NIL','NIL','NIL','NIL',
        'NIL','NIL','NIL','NIL','NIL','NIL','NIL','NIL','NIL','NIL','NIL','NIL','NIL','NIL','NIL','NIL','NIL','NIL','NIL','NIL','NIL',
        'NIL','NIL','NIL','NIL','NIL','NIL','NIL','NIL','NIL','NIL','NIL','NIL','NIL','NIL','NIL','NIL','NIL','NIL','NIL','NIL','NIL',
        'NIL','NIL','NIL','NIL','NIL','NIL','NIL','NIL','NIL','NIL','NIL','NIL','NIL','NIL','NIL','NIL','NIL','NIL','NIL','NIL','NIL',
        'NIL','NIL','NIL','NIL','NIL','NIL','NIL','NIL','NIL','NIL','NIL','NIL','NIL','NIL','NIL','NIL','NIL','NIL','NIL','NIL','NIL',
        'NIL','NIL','NIL','NIL','NIL','NIL','NIL','NIL','NIL','NIL','NIL','NIL','NIL','NIL','NIL','NIL','NIL','NIL','NIL','NIL','NIL',
        'NIL','NIL','NIL','NIL','NIL','NIL','NIL','NIL','NIL','NIL','NIL','NIL','NIL','NIL','NIL','NIL','NIL','NIL','NIL','NIL','NIL',
      ],
      npcs: [
        'NIL','NIL','NIL','NIL','NIL','NIL','NIL','NIL','NIL','NIL','NIL','NIL','NIL','NIL','NIL','NIL','NIL','NIL','NIL','NIL','NIL',
        'NIL','NIL','NIL','NIL','NIL','NIL','NIL','NIL','NIL','NIL','NIL','NIL','NIL','NIL','NIL','NIL','NIL','NIL','NIL','NIL','NIL',
        'NIL','NIL','B01','NIL','NIL','NIL','NIL','NIL','NIL','NIL','NIL','NIL','NIL','NIL','NIL','NIL','NIL','NIL','NIL','NIL','NIL',
        'NIL','NIL','NIL','NIL','NIL','NIL','NIL','NIL','NIL','B01','NIL','NIL','NIL','NIL','NIL','NIL','NIL','NIL','NIL','NIL','NIL',
        'NIL','NIL','NIL','NIL','NIL','NIL','NIL','NIL','NIL','NIL','NIL','NIL','NIL','NIL','NIL','NIL','NIL','NIL','NIL','B01','NIL',
        'NIL','NIL','NIL','B01','NIL','NIL','NIL','NIL','NIL','NIL','NIL','NIL','NIL','NIL','NIL','NIL','NIL','NIL','NIL','NIL','NIL',
        'NIL','B01','NIL','NIL','NIL','NIL','NIL','NIL','NIL','NIL','NIL','B01','NIL','NIL','NIL','NIL','NIL','NIL','NIL','NIL','NIL',
        'NIL','NIL','NIL','NIL','NIL','NIL','NIL','NIL','NIL','NIL','NIL','NIL','NIL','NIL','NIL','NIL','NIL','NIL','NIL','B01','NIL',
        'NIL','NIL','B01','NIL','B01','NIL','NIL','NIL','NIL','NIL','NIL','NIL','NIL','NIL','NIL','NIL','B01','NIL','NIL','NIL','NIL',
        'NIL','NIL','NIL','NIL','NIL','NIL','NIL','NIL','NIL','NIL','NIL','NIL','NIL','NIL','NIL','NIL','NIL','NIL','NIL','NIL','NIL',
        'NIL','NIL','NIL','NIL','B01','NIL','NIL','NIL','B01','NIL','NIL','NIL','NIL','NIL','NIL','NIL','NIL','NIL','NIL','NIL','NIL',
        'NIL','NIL','NIL','NIL','NIL','NIL','NIL','B01','NIL','NIL','NIL','NIL','NIL','NIL','NIL','NIL','NIL','NIL','NIL','NIL','NIL',
        'NIL','NIL','NIL','NIL','NIL','NIL','NIL','NIL','NIL','NIL','NIL','NIL','NIL','NIL','NIL','NIL','NIL','NIL','B01','NIL','NIL',
        'NIL','NIL','NIL','NIL','NIL','B01','NIL','NIL','NIL','B01','NIL','NIL','NIL','NIL','NIL','NIL','NIL','NIL','NIL','NIL','NIL',
        'NIL','NIL','NIL','NIL','NIL','NIL','NIL','NIL','NIL','NIL','NIL','NIL','NIL','NIL','B01','NIL','NIL','NIL','NIL','NIL','NIL',
        'NIL','NIL','NIL','NIL','NIL','NIL','NIL','NIL','NIL','NIL','NIL','NIL','NIL','NIL','NIL','NIL','NIL','NIL','NIL','NIL','NIL',
        'NIL','NIL','NIL','NIL','NIL','NIL','NIL','NIL','NIL','NIL','NIL','NIL','NIL','NIL','NIL','NIL','NIL','NIL','NIL','NIL','NIL',
        'NIL','NIL','B01','NIL','NIL','NIL','NIL','B01','NIL','NIL','NIL','B01','NIL','NIL','NIL','NIL','NIL','NIL','NIL','NIL','NIL',
        'NIL','NIL','NIL','NIL','NIL','NIL','NIL','NIL','NIL','NIL','NIL','NIL','NIL','NIL','NIL','NIL','NIL','NIL','NIL','NIL','NIL',
        'NIL','NIL','NIL','NIL','NIL','NIL','B01','NIL','NIL','NIL','NIL','NIL','NIL','NIL','NIL','NIL','NIL','NIL','NIL','NIL','NIL',
        'NIL','NIL','NIL','NIL','NIL','NIL','NIL','NIL','NIL','NIL','NIL','NIL','NIL','NIL','NIL','NIL','NIL','NIL','NIL','NIL','NIL',
      ],
      cols: 21,
      rows: 21,
      tile_diameter: 320,
      start_position: {
        x: 1,
        y: 1
      }
    }
  },


  keys: {
    up: 38,
    right: 39,
    down: 40,
    left: 37,
    interact: 69
  },

  player: {
    gait_slowness: 230,
    gait_animation_curve: 'linear',
    location: {
      x: 0,
      y: 0,
      get_cell: function(coords) {
        cell_num = (coords.y * self.level.cols) + coords.x;
        return cell_num;
      }
    },

    can_move: function(direction) {
      switch(direction) {
        case 'up':
          prospective_cell = self.player.location
            .get_cell({
              x: self.player.location.x,
              y: self.player.location.y - 1
            })
          break;
        case 'right':
          prospective_cell = self.player.location
            .get_cell({
              x: self.player.location.x + 1,
              y: self.player.location.y
            })
          break;
        case 'down':
          prospective_cell = self.player.location
            .get_cell({
              x: self.player.location.x,
              y: self.player.location.y + 1
            })
          break;
        case 'left':
          prospective_cell = self.player.location
            .get_cell({
              x: self.player.location.x - 1,
              y: self.player.location.y
            })
          break;
      }
      return (
        self.tile_types[self.level.map[prospective_cell]].walkable &&
        self.item_types[self.level.items[prospective_cell]].walkable &&
        self.npc_types[self.level.npcs[prospective_cell]].walkable
      );
    },

    sprite: {
      img_path: 'images/sprites/player/walk_down.png',
      diameter: 320,
      framerate: 100,
      num_frames: 4,

      cycle_frames: function(current_frame) {
        sprite_sheet_handle = $('#spritesheet-player');

        setInterval(function() {
          if (n >= self.player.sprite.num_frames) {
            n = 0;
          }
          sprite_sheet_handle.attr('src', self.player.sprite.img_path);
          sprite_sheet_handle.css('left', -(n * 320) + 'px');
          n++;
        }, self.player.sprite.framerate);

      }
    }
  },

  tile_types: {
    NIL: {
      img_path: 'empty.png',
      walkable: true
    },
    F00: {
      img_path: 'tiles/floor_0030.png',
      walkable: true
    },
    W00: {
      img_path: 'tiles/wall_0030.png',
      walkable: false
    }
  },

  item_types: {
    NIL: {
      img_path: 'empty.png',
      walkable: true
    }
  },

  npc_types: {
    NIL: {
      img_path: 'empty.png',
      walkable: true
    },
    B01: {
      img_path: 'sprites/npc/red_balloon_single_frame.png',
      walkable: true,
      interactable: true,
      frames: 4
    }
  }

}
